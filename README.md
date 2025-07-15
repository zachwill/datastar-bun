# Datastar + Bun Examples

A collection of interactive examples demonstrating how to use [Datastar](https://github.com/starfederation/datastar) with [Bun](https://bun.sh/) for building reactive web applications with server-sent events.

## What is Datastar?

Datastar is a hypermedia-driven framework that brings reactive frontend capabilities to server-rendered applications. It allows you to build interactive web apps using declarative HTML attributes and server-side rendering, with real-time updates via Server-Sent Events.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

The server will start on `http://localhost:5555`

## Examples

This project includes several interactive examples showcasing different Datastar features:

- **Welcome** (`/`) - Homepage with project information
- **Counter** (`/counter`) - Simple counter with increment/decrement buttons
- **Chat** (`/chat`) - Real-time chat using Server-Sent Events
- **Clock** (`/clock`) - Live updating clock display
- **Slider** (`/slider`) - Interactive slider component
- **Time** (`/time`) - Time display with various formatting options

## Project Structure

```
src/
├── server.ts          # Main server with Bun.serve() and route consolidation
├── components/        # Reusable React components
│   └── shell.tsx     # App shell wrapper with navigation
├── lib/              # Core utilities and helpers
│   ├── expr.ts       # Datastar expression language helpers
│   ├── html.ts       # HTML response utilities
│   └── sse.ts        # Comprehensive Server-Sent Events utilities
└── pages/            # Individual page examples
    ├── chat.tsx      # Real-time chat with SSE
    ├── clock.tsx     # Live clock updates
    ├── counter.tsx   # Interactive counter
    ├── slider.tsx    # Range slider component
    ├── time.tsx      # Time formatting examples
    └── welcome.tsx   # Welcome page
```

## Key Features

### Server-Sent Events (SSE) Utilities

The `src/lib/sse.ts` module provides a comprehensive set of utilities for working with Datastar:

- **`isDatastarRequest()`** - Detect if a request is from Datastar
- **`executeScript()`** - Execute JavaScript in the browser with optional selector targeting
- **`patchElements()`** - Update DOM elements with multiple merge modes (outer, inner, replace, append, prepend, before, after, remove)
- **`patchSignals()`** - Update reactive signals with optional conditional updates
- **`readSignals()`** - Read Datastar signals from requests (GET/POST/FormData)
- **`tryReadSignals()`** - Safe version that returns Result type
- **`readSignalsWithDefaults()`** - Read signals with fallback defaults
- **`sse()`** - Create Server-Sent Event responses with multiple overloads

### Datastar Integration Patterns

- **Reactive Data Binding** - Using `data-signals` for state management
- **Event Handling** - Using `data-on-click`, `data-on-input`, etc.
- **Real-time Updates** - Server-Sent Events for live data streaming
- **DOM Manipulation** - Server-driven element updates and script execution
- **Expression Language** - Datastar's reactive expression system

### Server Architecture

Built with `Bun.serve()` using a consolidated routing approach:

```ts
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
        "/public/*": (req) => new Response(Bun.file(`public/${path}`)),
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});
```

## Example Usage

### Simple Counter with SSE

```tsx
export const routes = {
    "/counter": () => html(
        <div data-signals='{"count": 0}'>
            <p data-text="$count"></p>
            <button data-on-click="post('/counter/increment')">+</button>
            <button data-on-click="post('/counter/decrement')">-</button>
        </div>
    ),
    "/counter/increment": () => sse(patchSignals({ count: "$count + 1" })),
    "/counter/decrement": () => sse(patchSignals({ count: "$count - 1" })),
};
```

### Real-time Chat with SSE

```tsx
export const routes = {
    "/chat": () => html(/* chat interface */),
    "/chat/messages": () => sse(async function* () {
        // Stream real-time messages
        for await (const message of messageStream) {
            yield patchElements(
                <div class="message">{message.text}</div>,
                { selector: "#messages", mode: "append" }
            );
        }
    }),
};
```

## Development

- The server uses Bun's built-in hot reload (`bun --hot src/server.ts`)
- Static assets are served from the `public/` directory
- All routing is consolidated in `src/server.ts`
- Pages export route objects for clean organization

## Learn More

- [Datastar Documentation](https://github.com/starfederation/datastar)
- [Bun Documentation](https://bun.sh/docs)
- [Server-Sent Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)