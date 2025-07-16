import { html, sse, interval, patchSignals } from "../lib/sse";
import { Datastar } from "../lib/datastar";
import Shell from "../components/shell";

export type Signals = {
  clock?: string;
};

const $ = Datastar<Signals>();

export const routes = {
  "/clock": () => html(
    <Shell>
      <h1>Clock</h1>
      <h2 id="server-time"
        {...{
          "data-text": $`$clock`,
          "data-on-load": "@get('/sse/clock')",
        }}>
        Loading...
      </h2>
    </Shell >
  ),
  "/sse/clock": sse(async function* (req: Request, signals: Signals) {
    yield patchSignals({ clock: new Date().toLocaleTimeString() });
    for await (const _ of interval(1000)) {
      yield patchSignals({ clock: new Date().toLocaleTimeString() });
    }
  }),
} as const;