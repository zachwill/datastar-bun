import { tryReadSignals } from "../lib/sse";

export const routes = {
  "/api/time": async (req: Request) => {
    const reader = await tryReadSignals(req);
    if (!reader.success) {
      console.error(reader.error);
      return new Response(`<p>Error reading signals</p>`, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    return Response.json({ now: new Date().toISOString() });
  },
} as const;