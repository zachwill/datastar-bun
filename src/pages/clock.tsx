import { channel, patchSignals } from "../lib/sse";
import { html } from '../lib/html';
import Shell from "../components/shell";

export const routes = {
  "/clock": () => html(
    <Shell>
      <h1>Clock</h1>
      <h2 id="server-time"
        {...{
          "data-on-interval__duration.1s.leading": "@get('/sse/clock')",
          "data-on-signal-patch": "el.textContent = patch.clock"
        }}>
        --:--:--
      </h2>
    </Shell>
  ),
  "/sse/clock": channel(async function* (req: Request, signals: Record<string, any>) {
    yield patchSignals({ clock: new Date().toLocaleTimeString() });
  }),
} as const;