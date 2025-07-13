export const routes = {
  "/api/time": {
    GET: () => Response.json({ now: new Date().toISOString() }),
  },
} as const;