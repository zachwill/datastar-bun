import { Datastar } from "../lib/expr";

interface Signals { counter: number }
const $ = Datastar<Signals>();

export default () => (
  <>
    <h1>Counter</h1>
    <div role="group" {...$({ counter: 0 })} style={{ alignItems: "center" }}>
      <button data-on-click={$`counter -= 1`}>-</button>
      <h2 style={{ textAlign: "center" }} data-text={$`counter`} />
      <button data-on-click={$`counter += 1`}>+</button>
    </div>
  </>
);