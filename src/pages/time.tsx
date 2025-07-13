import { html } from "../lib/html";
import { Datastar } from "../lib/expr";

interface Signals { now: string }
const $ = Datastar<Signals>();

export default async function Time() {
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
      <body>
        <p id="clock"
          {...{
            "data-on-interval__duration.5s": "@get('/api/time')",
            "data-on-signal-patch": "el.textContent = patch.now"
          }}>
          {new Date().toISOString()}
        </p>
      </body>
    </html >,
  );
}