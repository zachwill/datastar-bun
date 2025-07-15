import { html, sse, patchSignals } from "../lib/sse";
import { Datastar } from "../lib/datastar";
import Shell from "../components/shell";

export type Signals = {
  slider?: number;
};

const $ = Datastar<Signals>();

export const routes = {
  "/slider": () => html(
    <Shell>
      <h1>Slider</h1>
      <div {...$({ slider: 0 })}>
        <div className="grid">
          <input type="range" min="0" max="99"
            {...{
              "data-bind-slider": "",
              "data-on-interval__duration.120ms.leading": "@get('/sse/slider')",
            }} />
          <output {...{ "data-text": $`$slider` }} />
        </div>
      </div>
    </Shell>
  ),

  "/sse/slider": sse(async function* (req: Request, signals: Record<string, any>) {
    const value = Number(signals.slider) || 0;
    yield patchSignals({
      slider: (value + 2) % 100,
    });
  }),
} as const;