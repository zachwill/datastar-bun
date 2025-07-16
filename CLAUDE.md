# Datastar + Bun Project Overview

This is a **Datastar** + **Bun** project that demonstrates real-time web applications using Server-Sent Events (SSE) and reactive data binding.

## Project Purpose

This project showcases how to build reactive, real-time web applications using:
- **Datastar** - A frontend framework for reactive data binding and real-time updates
- **Bun** - A fast JavaScript runtime and bundler
- **Server-Sent Events (SSE)** - For real-time server-to-client communication

## Architecture Overview

### Core Components

1. **Server** (`src/server.ts`) - Main Bun server with consolidated routing
2. **Pages** (`src/pages/`) - Individual example pages, each exports routes
3. **Components** (`src/components/`) - Reusable React components
4. **Libraries** (`src/lib/`) - Core utilities for SSE and Datastar integration

### Key Architecture Patterns

- **Consolidated Routing** - All routes are imported and merged in `server.ts`
- **Page-based Organization** - Each page exports a `routes` object
- **SSE-first Real-time** - Server-driven updates via Server-Sent Events
- **Reactive Data Binding** - Datastar handles client-side reactivity

## Project Structure

```
src/
├── server.ts          # Main server with Bun.serve() and consolidated routes
├── components/        # Reusable React components
│   └── shell.tsx     # App shell with navigation
├── lib/              # Core utilities
│   ├── datastar.ts   # Datastar expression helpers
│   └── sse.ts        # Server-Sent Events utilities
└── pages/            # Individual examples
    ├── chat.tsx      # Real-time chat
    ├── clock.tsx     # Live clock
    ├── counter.tsx   # Interactive counter
    ├── slider.tsx    # Range slider
    ├── time.tsx      # Time formatting
    └── welcome.tsx   # Welcome page
```

## Key Libraries and Utilities

### SSE Utilities (`src/lib/sse.ts`)

This is the core of the real-time functionality:

- **`sse(async function* (req, signals) { ... })`** - Creates SSE streams
- **`interval(ms)`** - Server-side timing (eliminates client polling)
- **`patchElements(html, {selector, mode})`** - Updates DOM elements
- **`patchSignals(signals)`** - Updates reactive state
- **`readSignals(req)`** - Reads signals from requests (GET/POST/FormData)

### Datastar Integration (`src/lib/datastar.ts`)

Helper functions for Datastar's reactive expressions and data binding.

## Example Pages

Each example demonstrates different Datastar + SSE patterns:

- **Welcome** (`/`) - Homepage with navigation
- **Counter** (`/counter`) - Simple reactive counter
- **Chat** (`/chat`) - Real-time chat with SSE updates
- **Clock** (`/clock`) - Live updating clock
- **Slider** (`/slider`) - Interactive range slider
- **Time** (`/time`) - Time display with formatting

## Common Patterns

### Page Structure

Each page exports a `routes` object:

```tsx
export const routes = {
    "/page": () => html(<Shell>/* content */</Shell>),
    "/sse/page": sse(async function* (req, signals) {
        // SSE logic
    }),
} as const;
```

### Real-time Updates

Server-driven updates using SSE:

```tsx
"/sse/clock": sse(async function* (req: Request, signals: Signals) {
    yield patchSignals({ time: new Date().toISOString() });
    for await (const _ of interval(1000)) {
        yield patchSignals({ time: new Date().toISOString() });
    }
}),
```

### Client-side Reactivity

Using Datastar attributes for reactive behavior:

```tsx
<div {...$({ counter: 0 })}>
    <button {...{ "data-on-click": $`$counter -= 1` }}>-</button>
    <h2 {...{ "data-text": $`$counter` }} />
    <button {...{ "data-on-click": $`$counter += 1` }}>+</button>
</div>
```

## Development Workflow

- **Server**: Runs on port 5555 with hot reload
- **Static Assets**: Served from `public/` directory
- **Routing**: Consolidated in `server.ts` with page-based organization
- **Real-time**: Server-side intervals preferred over client polling

## Key Concepts for AI Assistants

1. **Server-side Timing** - Use `interval()` on the server rather than client-side polling
2. **Reactive State** - Datastar handles client-side reactivity via `data-*` attributes
3. **SSE Streams** - Use generator functions for real-time updates
4. **Consolidated Routing** - All page routes are imported and merged in `server.ts`
5. **Page Organization** - Each page is self-contained with its own routes
6. **Security** - Path traversal protection for static assets

## Important Notes

- This project uses Bun as the runtime (not Node.js)
- SSE utilities handle all Datastar protocol requirements
- Server-side intervals are preferred over client-side polling
- All routing is consolidated in a single server file
- Pages export route objects for clean organization
- Static assets are served with security checks
