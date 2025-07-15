import { sse, patchSignals, html } from "../lib/sse";
import Shell from "../components/shell";

export type Signals = {
  slider: number
};

export const routes = {
  "/slider": () => html(
    <Shell>
      <h1>Slider</h1>
      <div {...{ "data-signals": JSON.stringify({ slider: 0 }) }}>
        <div className="grid">
          <input type="range" min="0" max="99"
            {...{
              "data-bind-slider": "",
              "data-on-interval__duration.1s.leading": "@get('/sse/slider')",
            }} />
          <output {...{ "data-text": "$slider" }}></output>
        </div>
      </div>
    </Shell>
  ),

  "/sse/slider": sse(async function* (req: Request, signals: Record<string, any>) {
    const value = Number(signals.slider) || 0;
    yield patchSignals({
      slider: (value + 4) % 100,
    });
  }),
} as const;