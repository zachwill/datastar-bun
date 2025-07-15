import { channel, patchSignals } from "../lib/sse";

export const routes = {
  "/sse/slider": channel(async function* (req: Request, signals: Record<string, any>) {
    const value = Number(signals.slider) || 0;

    yield patchSignals({
      slider: (value + 4) % 100,
    });
  }),
} as const;