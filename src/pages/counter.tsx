import { Datastar } from "../lib/expr";
import { html } from '../lib/html';
import Shell from "../components/shell";

interface Signals { counter: number }
const $ = Datastar<Signals>();

export const routes = {
  "/counter": () => html(
    <Shell>
      <h1>Counter</h1>
      <div role="group" {...$({ counter: 0 })} style={{ alignItems: "center" }}>
        <button data-on-click={$`counter -= 1`}>-</button>
        <h2 style={{ textAlign: "center" }} data-text={$`counter`} />
        <button data-on-click={$`counter += 1`}>+</button>
      </div>
    </Shell>
  ),
} as const;