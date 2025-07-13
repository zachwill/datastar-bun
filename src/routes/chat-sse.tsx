import { sse, patch } from "../lib/sse";
import type { Signals } from "../pages/chat";
const p = patch<Signals>();

export const routes = {
  "/sse/chat": {
    GET: () => {
      let intervalId: NodeJS.Timeout;

      return sse.stream(stream => {
        let id = 0;
        const send = (txt: string) => {
          stream.patchElements(
            `<li id="m${++id}">${txt}</li>`,
            { selector: "#chat", mode: "append" },
          );
          stream.patchSignals(p({ lastMsg: txt }));
        };
        intervalId = setInterval(() => send("Ping " + new Date().toLocaleTimeString()), 3_000);
      }, {
        keepalive: true,
        onAbort: () => {
          if (intervalId) clearInterval(intervalId);
        }
      });
    },
  },
} as const;