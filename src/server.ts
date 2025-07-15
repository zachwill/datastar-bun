import { serve } from "bun";
import { join, resolve, relative } from "path";
import { existsSync } from "fs";

import { html } from "./lib/html";
import Shell from "./components/shell";

import * as App from "./pages/app";
import * as Chat from "./pages/chat";
import * as Time from "./pages/time";
import * as Clock from "./pages/clock";
import * as Slider from "./pages/slider";
import * as Counter from "./pages/counter";
import * as Welcome from "./pages/welcome";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        ...Welcome.routes,
        ...App.routes,
        ...Chat.routes,
        ...Time.routes,
        ...Clock.routes,
        ...Slider.routes,
        ...Counter.routes,
        "/public/*": (req: Request) => {
            const url = new URL(req.url);
            const requestedPath = url.pathname.slice("/public/".length);

            // Security check: prevent path traversal attacks
            if (requestedPath.includes("..") || requestedPath.includes("//")) {
                return new Response("Forbidden", { status: 403 });
            }

            // Resolve the full path and ensure it's within the public directory
            const publicDir = resolve("public");
            const fullPath = resolve(join(publicDir, requestedPath));

            // Double-check that the resolved path is still within public directory
            const relativePath = relative(publicDir, fullPath);
            if (relativePath.startsWith("..") || relativePath.includes("..")) {
                return new Response("Forbidden", { status: 403 });
            }

            // Check if file exists
            if (existsSync(fullPath)) {
                return new Response(Bun.file(fullPath));
            } else {
                return new Response("Not Found", { status: 404 });
            }
        }
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});

console.log("👉  http://localhost:5555");