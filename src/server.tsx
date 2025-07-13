import { serve } from "bun";

import { html } from "./lib/html";
import Shell from "./components/shell";

import AppPage from "./pages/app";
import CounterPage from "./pages/counter";
import TimePage from "./pages/time";
import ClockPage from "./pages/clock";
import SliderPage from "./pages/slider";
import ChatPage from "./pages/chat";
import WelcomePage from "./pages/welcome";

import { routes as timeJSON } from "./routes/time-json";
import { routes as clockJSON } from "./routes/clock-json";
import { routes as sliderSSE } from "./routes/slider-sse";
import { routes as chatSSE } from "./routes/chat-sse";
import { routes as publicRoutes } from "./routes/public";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        "/": () => html(<Shell><WelcomePage /></Shell >),
        "/app": () => html(<AppPage />),
        "/counter": () => html(<Shell><CounterPage /></Shell >),
        "/time": () => html(<Shell><TimePage /></Shell >),
        "/clock": () => html(<Shell><ClockPage /></Shell >),
        "/slider": () => html(<Shell><SliderPage /></Shell >),
        "/chat": () => html(<Shell><ChatPage /></Shell >),
        ...timeJSON,
        ...clockJSON,
        ...sliderSSE,
        ...chatSSE,
        ...publicRoutes,
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});

console.log("👉  http://localhost:5555");