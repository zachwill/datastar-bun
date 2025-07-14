import { Datastar } from "../lib/expr";

export type Signals = { slider: number }
const $ = Datastar<Signals>();

export default () => (
  <>
    <h1>Slider</h1>
    <div {...$({ slider: 0 })}>
      <div className="grid">
        <input type="range" min="0" max="99"
          {...{
            "data-bind-slider": "",
            "data-on-interval__duration.1s.leading": "@get('/sse/slider')",
          }} />
        <output data-text={$`slider`}></output>
      </div>
    </div>
  </>
);