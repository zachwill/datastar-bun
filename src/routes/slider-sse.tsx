import { sse, patch } from "../lib/sse";
import type { Signals } from "../pages/slider";    // re-export if needed

const p = patch<Signals>();

export const routes = {
  "/sse/slider": async (req: Request) => {
    const reader = await sse.readSignals(req);
    if (!reader.success) {
      console.error(reader.error);
      return new Response(`<p>Error reading signals</p>`, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    let value = Number(reader.signals?.slider) || 0;
    return sse.stream(stream => {
      stream.patchSignals(JSON.stringify({
        slider: value = (value + 4) % 100,
      }));
    });
  },
} as const;