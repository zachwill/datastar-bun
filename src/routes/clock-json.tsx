import { channel, patchSignals } from "../lib/sse";

export const routes = {
    "/api/clock": channel(async function* (req: Request, signals: Record<string, any>) {
        yield patchSignals({ clock: new Date().toLocaleTimeString() });
    }),
} as const;