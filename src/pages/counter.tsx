import { html } from "../lib/html";
import { Datastar } from "../lib/expr";

interface Signals { counter: number }
const $ = Datastar<Signals>();

export default async function Counter() {
  return html(
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <script type="module"
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@main/bundles/datastar.js"></script>
      </head>
      <body {...$({ counter: 0 })}>
        <h1 data-text={$`counter`} />
        <button data-on-click={$`counter++`}>+</button>
      </body>
    </html>,
  );
}