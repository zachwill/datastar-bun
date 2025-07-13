import { sse, patch } from "../lib/sse";
import type { Signals } from "../pages/chat";
const p = patch<Signals>();

export const routes = {
  "/sse/chat": {
    GET: () => sse.stream(stream => {
      let id = 0;
      const send = (txt: string) => {
        stream.patchElements(
          `<li id="m${++id}">${txt}</li>`,
          { selector: "#chat", mode: "append" },
        );
        stream.patchSignals(p({ lastMsg: txt }));
      };
      setInterval(() => send("Ping " + new Date().toLocaleTimeString()), 3_000);
    }, { keepalive: true }),
  },
} as const;