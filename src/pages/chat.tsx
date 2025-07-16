import { html, sse, interval, patchElements, patchSignals } from "../lib/sse";
import { Datastar } from "../lib/datastar";
import Shell from "../components/shell";

export type Signals = {
  lastMsg?: string;
  fromURL?: string;
};

const $ = Datastar<Signals>();

export const routes = {
  "/chat": html(
    <Shell>
      <h1>Chat</h1>
      <ul id="chat" {...{
        "data-on-load": "@get('/sse/chat')",
      }}></ul>
      <p>Last: <strong {...{ "data-text": $`$lastMsg` }}></strong></p>
    </Shell>
  ),

  "/sse/chat": sse(async function* (req: Request, signals: Signals) {
    yield patchElements(<li>Chat starting...</li>, { selector: "#chat", mode: "prepend" });
    for await (const _ of interval(1000)) {
      const msg = `Ping ${new Date().toLocaleTimeString()}`;
      yield patchElements(
        `<li>${msg}</li>`,
        { selector: "#chat", mode: "append" }
      );
      yield patchSignals({ lastMsg: msg });
    }
  })
} as const;