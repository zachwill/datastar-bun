export const routes = {
    "/api/clock": {
        GET: () => Response.json({ clock: new Date().toLocaleTimeString() }),
    },
} as const;