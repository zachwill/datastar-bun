import { serve } from "bun";

import counter from "./routes/counter";
import timePage from "./pages/time";
import clockPage from "./pages/clock";
import sliderPage from "./pages/slider";
import chatPage from "./pages/chat";

import { routes as timeJSON } from "./routes/time-json";
import { routes as clockJSON } from "./routes/clock-json";
import { routes as sliderSSE } from "./routes/slider-sse";
import { routes as chatSSE } from "./routes/chat-sse";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        "/": counter,
        "/time": timePage,
        "/clock": clockPage,
        "/slider": sliderPage,
        "/chat": chatPage,
        ...timeJSON,
        ...clockJSON,
        ...sliderSSE,
        ...chatSSE,
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});

console.log("👉  http://localhost:5555");