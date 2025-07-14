import { sse } from "../lib/sse";

export const routes = {
  "/sse/chat": async (req: Request) => {
    const reader = await sse.readSignals(req);

    if (!reader.success) {
      console.error(reader.error);
      return new Response(`<p>Error reading signals</p>`, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    return sse.stream(stream => {
      // Send initial message immediately
      const initialMessage = `Ping ${new Date().toLocaleTimeString()}`;
      stream.patchElements(
        `<li>${initialMessage}</li>`,
        { selector: "#chat", mode: "append" },
      );
      stream.patchSignals(JSON.stringify({ lastMsg: initialMessage }));
    });
  }
} as const;