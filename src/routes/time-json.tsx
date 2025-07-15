import { channel, patchSignals } from "../lib/sse";

export const routes = {
  "/api/time": channel(async function* (req: Request, signals: Record<string, any>) {
    yield patchSignals({ now: new Date().toISOString() });
  }),
} as const;