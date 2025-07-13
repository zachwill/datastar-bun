import { html } from "../lib/html";

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
    <body>
      <h1 id="server-time"
        {...{
          "data-on-interval__duration.500ms": "@get('/api/clock')",
          "data-on-signal-patch": "el.textContent = patch.clock"
        }}>
        --:--:--
      </h1>
    </body>
  </html>,
);