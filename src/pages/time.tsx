import { Datastar } from "../lib/expr";
import { sse, patchSignals } from "../lib/sse";
import { html } from '../lib/html';
import Shell from "../components/shell";

interface Signals { now: string }
const $ = Datastar<Signals>();

export const routes = {
  "/time": () => html(
    <Shell>
      <h1>Time</h1>
      <p id="clock"
        {...{
          "data-on-interval__duration.1s.leading": "@get('/api/time')",
          "data-on-signal-patch": "el.textContent = patch.now"
        }}>
        {new Date().toISOString()}
      </p>
    </Shell>
  ),
  "/api/time": sse(async function* (req: Request, signals: Record<string, any>) {
    yield patchSignals({ now: new Date().toISOString() });
  }),
} as const;