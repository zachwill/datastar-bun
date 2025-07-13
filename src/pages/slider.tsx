import { html } from "../lib/html";
import { Datastar } from "../lib/expr";

export type Signals = { slider: number }
const $ = Datastar<Signals>();

export default () => html(
  <html>
    <head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />
      <script type="module"
        src="https://cdn.jsdelivr.net/gh/starfederation/datastar@main/bundles/datastar.js"></script>
    </head>
    <body {...$({ slider: 0 })}>
      <input type="range" min="0" max="99"
        {...{
          "data-bind-slider": "",
          "data-on-load": "@get('/sse/slider')",
        }} />
      <output data-text={$`slider`}></output>
    </body>
  </html>,
);