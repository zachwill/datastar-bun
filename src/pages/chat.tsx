import { html } from "../lib/html";
import { Datastar } from "../lib/expr";

export type Signals = { lastMsg: string }
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
    <body {...$({ lastMsg: "" })}>
      <ul id="chat" {...{
        "data-on-load": "@get('/sse/chat')",
      }}></ul>
      <p>Last: <strong data-text={$`lastMsg`}></strong></p>
    </body>
  </html>,
);