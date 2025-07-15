import { html, sse, patchSignals } from "../lib/sse";
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
          "data-on-interval__duration.1s.leading": "@get('/sse/clock')",
        }}>
        Loading...
      </h2>
    </Shell >
  ),
  "/sse/clock": sse(async function* () {
    yield patchSignals({ clock: new Date().toLocaleTimeString() });
  }),
} as const;