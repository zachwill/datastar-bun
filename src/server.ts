import { serve } from "bun";

import * as Chat from "./pages/chat";
import * as Clock from "./pages/clock";
import * as Counter from "./pages/counter";
import * as Slider from "./pages/slider";
import * as Time from "./pages/time";
import * as Welcome from "./pages/welcome";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        ...Welcome.routes,
        ...Chat.routes,
        ...Clock.routes,
        ...Counter.routes,
        ...Slider.routes,
        ...Time.routes,
        "/public/*": (req: Request) => {
            const url = new URL(req.url);
            const requestedPath = url.pathname.slice("/public/".length);

            // Basic security check: prevent path traversal attacks
            if (requestedPath.includes("..")) {
                return new Response("Forbidden", { status: 403 });
            }

            // Bun handles content-type, streaming, and file existence automatically
            const file = Bun.file(`public/${requestedPath}`);
            return new Response(file);
        }
    },
    fetch() {
        return new Response("Not found", { status: 404 });
    },
});

console.log("👉  http://localhost:5555");