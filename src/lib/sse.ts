// SSE server utilities for Datastar
import type { JSX } from "react";

const NEWLINE = "\n";
const END = NEWLINE + NEWLINE;

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

export function sse(
    ...parts: (string | AsyncGenerator<string, void, unknown>)[]
): Response;
export function sse(
    generatorFn: () => AsyncGenerator<string>
): () => Response;
export function sse(
    generatorFn: (req: Request, signals: Record<string, any>) => AsyncGenerator<string>
): (req: Request) => Promise<Response>;

export function sse(
    ...parts: (string | AsyncGenerator<string, void, unknown> | Function)[]
): Response | (() => Response) | ((req: Request) => Promise<Response>) {
    if (parts.length === 1 && typeof parts[0] === "function") {
        const generatorFn = parts[0] as Function;

        if (generatorFn.length === 0) {
            return () => sse(generatorFn());
        } else {
            return async (req: Request) => {
                const result = await tryReadSignals(req);
                const signals = result.success ? result.signals : {};

                if (!result.success) {
                    console.warn(`Failed to read signals: ${result.error}`);
                }

                return sse(generatorFn(req, signals));
            };
        }
    }

    const gen: AsyncGenerator<string> =
        parts.length === 1 && typeof parts[0] !== "string" && typeof parts[0] !== "function"
            ? parts[0] as AsyncGenerator<string>
            : (async function* () {
                for (const part of parts) {
                    if (typeof part === "string") {
                        yield part;
                    } else if (typeof part !== "function") {
                        for await (const chunk of part) yield chunk;
                    }
                }
            })();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of gen) {
                    controller.enqueue(new TextEncoder().encode(chunk));
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}

declare global {
    function renderToString(element: JSX.Element): string;
}