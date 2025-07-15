import { serve } from "bun";

import { html } from "./lib/html";
import Shell from "./components/shell";

import AppPage from "./pages/app";
import * as Chat from "./pages/chat";
import * as Time from "./pages/time";
import * as Clock from "./pages/clock";
import * as Slider from "./pages/slider";
import * as Counter from "./pages/counter";
import WelcomePage from "./pages/welcome";

import { routes as publicRoutes } from "./routes/public";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        "/": () => html(<Shell><WelcomePage /></Shell >),
        "/app": () => html(<AppPage />),
        ...Chat.routes,
        ...Time.routes,
        ...Clock.routes,
        ...Slider.routes,
        ...Counter.routes,
        ...publicRoutes,
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});

console.log("👉  http://localhost:5555");