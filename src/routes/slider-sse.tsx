import { sse, patch } from "../lib/sse";
import type { Signals } from "../pages/slider";    // re-export if needed

const p = patch<Signals>();

export const routes = {
  "/sse/slider": {
    GET: () => sse.stream(stream => {
      let v = 0;
      setInterval(() => stream.patchSignals(p({ slider: v = (v + 4) % 100 })), 200);
    }, { keepalive: true }),
  },
} as const;