import { html, sse, patchSignals } from "../lib/sse";
import { Datastar } from "../lib/datastar";
import Shell from "../components/shell";

export type Signals = {
  now?: string;
};

const $ = Datastar<Signals>();

export const routes = {
  "/time": () => html(
    <Shell>
      <h1>Time</h1>
      <p id="clock"
        {...{
          ...$({ now: new Date().toISOString() }),
          "data-text": $`$now`,
          "data-on-interval__duration.1s": "@get('/sse/time')",
        }}>
      </p>
    </Shell>
  ),

  "/sse/time": sse(async function* (req: Request, signals: Record<string, any>) {
    yield patchSignals({ now: new Date().toISOString() });
  }),
} as const;