import { Datastar } from "../lib/expr";

export type Signals = { lastMsg: string }
const $ = Datastar<Signals>();

export default () => (
  <>
    <h1>Chat</h1>
    <ul id="chat" {...{
      "data-on-load": "@get('/sse/chat')",
    }}></ul>
    <p>Last: <strong data-text={$`lastMsg`}></strong></p>
  </>
);