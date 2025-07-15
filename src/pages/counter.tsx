import { html } from '../lib/sse';
import { Datastar } from "../lib/datastar";
import Shell from "../components/shell";

export type Signals = {
  counter?: number;
};

const $ = Datastar<Signals>();

export const routes = {
  "/counter": () => html(
    <Shell>
      <h1>Counter</h1>
      <div role="group" {...$({ counter: 0 })} style={{ alignItems: "center" }}>
        <button {...{ "data-on-click": $`$counter -= 1` }}>-</button>
        <h2 {...{ "data-text": $`$counter` }} style={{ textAlign: "center" }} />
        <button {...{ "data-on-click": $`$counter += 1` }}>+</button>
      </div>
    </Shell>
  ),
} as const;