import { channel, patchElements, patchSignals } from "../lib/sse";

export const routes = {
  "/sse/chat": channel(async function* (req: Request, signals: Record<string, any>) {
    const url = new URL(req.url);
    const initialMessage = `Ping ${new Date().toLocaleTimeString()}`;

    yield patchElements(
      `<li>${initialMessage}</li>`,
      { selector: "#chat", mode: "append" }
    );

    yield patchSignals({ lastMsg: initialMessage, fromURL: url });
  })
} as const;