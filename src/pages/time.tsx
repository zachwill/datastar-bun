import { Datastar } from "../lib/expr";

interface Signals { now: string }
const $ = Datastar<Signals>();

export default () => (
  <>
    <h1>Time</h1>
    <p id="clock"
      {...{
        "data-on-interval__duration.5s": "@get('/api/time')",
        "data-on-signal-patch": "el.textContent = patch.now"
      }}>
      {new Date().toISOString()}
    </p>
  </>
);