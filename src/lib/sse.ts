// SSE server utilities for Datastar
import type { JSX } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";

const NEWLINE = "\n";
const END = NEWLINE + NEWLINE;

export function html(node: JSX.Element): Response {
    return new Response(
        renderToStaticMarkup(node),
        { headers: { "content-type": "text/html; charset=utf-8" } },
    );
}

function multiline(prefix: string, text: string) {
    return text
        .split(/\r?\n/)
        .map((l, i) => (i === 0 ? `data: ${prefix}` : `data: ${prefix.trim()} `) + l)
        .join(NEWLINE);
}

function isRecord(value: unknown): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Check if request is from Datastar */
export function isDatastarRequest(request: Request): boolean {
    // Check for Datastar-Request header
    if (request.headers.get("Datastar-Request") === "true") {
        return true;
    }

    // Check if Accept header includes text/event-stream
    const accept = request.headers.get("Accept") || "";
    if (accept.includes("text/event-stream")) {
        return true;
    }

    // Check for datastar query parameter or signals
    const url = new URL(request.url);
    if (url.searchParams.has("datastar")) {
        return true;
    }

    return false;
}

/** Execute a script in the browser */
export function executeScript(script: string, selector: string = "body") {
    return patchElements(
        `<script>${script}</script>`,
        { selector, mode: "append" }
    );
}

export type Mode =
    | "outer"
    | "inner"
    | "replace"
    | "append"
    | "prepend"
    | "before"
    | "after"
    | "remove";

export interface PatchElementsOpts {
    selector?: string;
    mode?: Mode;
    useViewTransition?: boolean;
}

/** Format a `datastar-patch-elements` SSE frame */
export function patchElements(
    html: string | JSX.Element,
    { selector, mode = "outer", useViewTransition }: PatchElementsOpts = {}
) {
    const htmlString = typeof html === "string"
        ? html
        : renderToString(html);

    const lines = [
        "event: datastar-patch-elements",
        mode && `data: mode ${mode}`,
        selector && `data: selector ${selector}`,
        useViewTransition ? "data: useViewTransition true" : null,
        multiline("elements ", htmlString),
    ].filter(Boolean);
    return lines.join(NEWLINE) + END;
}

export interface PatchSignalsOpts {
    onlyIfMissing?: boolean;
}

/** Format a `datastar-patch-signals` SSE frame */
export function patchSignals(
    signals: Record<string, any>,
    { onlyIfMissing = false }: PatchSignalsOpts = {}
) {
    const payload = JSON.stringify(signals);
    const lines = [
        "event: datastar-patch-signals",
        onlyIfMissing ? "data: onlyIfMissing true" : null,
        `data: signals ${payload}`,
    ].filter(Boolean);
    return lines.join(NEWLINE) + END;
}

/** Read Datastar signals from request, throws on error */
export async function readSignals(request: Request): Promise<Record<string, any>> {
    const result = await tryReadSignals(request);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.signals;
}

/** Safe version of readSignals that returns Result type */
export async function tryReadSignals(
    request: Request
): Promise<
    | { success: true; signals: Record<string, any> }
    | { success: false; error: string }
> {
    try {
        let data: unknown;

        if (request.method === "GET") {
            const url = new URL(request.url);
            const datastarParam = url.searchParams.get("datastar");

            if (!datastarParam) {
                return { success: false, error: "Missing 'datastar' query parameter" };
            }

            data = JSON.parse(datastarParam);
        } else {
            const contentType = request.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                data = await request.json();
            } else if (contentType.includes("application/x-www-form-urlencoded")) {
                const formData = await request.formData();
                const datastarField = formData.get("datastar");

                if (typeof datastarField === "string") {
                    data = JSON.parse(datastarField);
                } else {
                    data = Object.fromEntries(formData);
                }
            } else {
                data = await request.json();
            }
        }

        if (!isRecord(data)) {
            return {
                success: false,
                error: `Expected object, got ${Array.isArray(data) ? 'array' : typeof data}`
            };
        }

        return { success: true, signals: data };
    } catch (error) {
        if (error instanceof SyntaxError) {
            return { success: false, error: "Invalid JSON in request" };
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: message };
    }
}

/** Read signals with fallback defaults */
export async function readSignalsWithDefaults<T extends Record<string, any>>(
    request: Request,
    defaults: T
): Promise<T> {
    try {
        const signals = await readSignals(request);
        return { ...defaults, ...signals } as T;
    } catch {
        return defaults;
    }
}

/** 
 * Simple interval helper for SSE streams
 * Yields void at regular intervals, you control what to send
 */
export async function* interval(
    ms: number,
    options: { signal?: AbortSignal } = {}
): AsyncGenerator<void, void, unknown> {
    yield; // Always yield immediately

    while (!options.signal?.aborted) {
        await Bun.sleep(ms);
        if (!options.signal?.aborted) {
            yield;
        }
    }
}

// Simple overloads for the two cases you actually use
export function sse(
    generatorFn: () => AsyncGenerator<string>
): (req: Request) => Response;
export function sse(
    generatorFn: (req: Request, signals: Record<string, any>) => AsyncGenerator<string>
): (req: Request) => Promise<Response>;

export function sse(
    generatorFn: Function
): Function {
    // No args = simple generator
    if (generatorFn.length === 0) {
        return (req: Request) => {
            const gen = generatorFn();
            return createSSEResponse(gen, req.signal);
        };
    }

    // Has args = reads signals from request
    return async (req: Request) => {
        const result = await tryReadSignals(req);
        const signals = result.success ? result.signals : {};

        if (!result.success) {
            console.warn(`Failed to read signals: ${result.error}`);
        }

        const gen = generatorFn(req, signals);
        return createSSEResponse(gen, req.signal);
    };
}

function createSSEResponse(gen: AsyncGenerator<string>, signal?: AbortSignal): Response {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            // Handle abort signal
            const abortHandler = () => {
                console.log("SSE stream aborted by client");
                if (controller.desiredSize !== null) {
                    try {
                        controller.close();
                    } catch (e) {
                        console.warn("Could not close controller on abort:", e);
                    }
                }
            };

            signal?.addEventListener('abort', abortHandler);

            try {
                for await (const chunk of gen) {
                    // Check if aborted
                    if (signal?.aborted) {
                        console.log("SSE stream aborted, stopping generator");
                        break;
                    }

                    // Check if controller is still open before enqueuing
                    if (controller.desiredSize === null) {
                        // Controller is closed, break out of loop
                        break;
                    }

                    try {
                        controller.enqueue(encoder.encode(chunk));
                    } catch (error) {
                        // If enqueue fails, the controller is likely closed
                        console.warn("SSE enqueue failed (client likely disconnected):", error);
                        break;
                    }
                }
            } catch (error) {
                console.error("SSE stream error:", error);
                // Only try to error if controller is still open
                if (controller.desiredSize !== null) {
                    try {
                        controller.error(error);
                    } catch (e) {
                        console.warn("Could not error controller:", e);
                    }
                }
            } finally {
                // Clean up abort listener
                signal?.removeEventListener('abort', abortHandler);

                // Only close if not already closed
                if (controller.desiredSize !== null) {
                    try {
                        controller.close();
                    } catch (e) {
                        console.warn("Could not close controller:", e);
                    }
                }
            }
        },

        cancel() {
            // Called when client disconnects
            console.log("SSE stream cancelled (client disconnected)");
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}