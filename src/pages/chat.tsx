import { Datastar } from "../lib/expr";
import { sse, patchElements, patchSignals } from "../lib/sse";
import { html } from '../lib/html';
import Shell from "../components/shell";

export type Signals = { lastMsg: string }
const $ = Datastar<Signals>();

export const routes = {
  "/chat": () => html(
    <Shell>
      <h1>Chat</h1>
      <ul id="chat" {...{
        "data-on-interval__duration.1s.leading": "@get('/sse/chat')",
      }}></ul>
      <p>Last: <strong data-text={$`lastMsg`}></strong></p>
    </Shell>
  ),
  "/sse/chat": sse(async function* (req: Request, signals: Record<string, any>) {
    const url = new URL(req.url);
    const initialMessage = `Ping ${new Date().toLocaleTimeString()}`;

    yield patchElements(
      `<li>${initialMessage}</li>`,
      { selector: "#chat", mode: "append" }
    );

    yield patchSignals({ lastMsg: initialMessage, fromURL: url });
  })
} as const;