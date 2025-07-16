---
description: Bun usage
globs: **/*
alwaysApply: true
---

# Use Bun Instead of Node.js/npm/pnpm/vite

Default to using Bun instead of Node.js for all operations.

## Commands

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file()` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Server Architecture

Use `Bun.serve()` with consolidated routing pattern:

```ts#server.ts
import { serve } from "bun";
import * as Welcome from "./pages/welcome";
import * as Chat from "./pages/chat";

serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        ...Welcome.routes,
        ...Chat.routes,
        "/public/*": (req: Request) => {
            const url = new URL(req.url);
            const requestedPath = url.pathname.slice("/public/".length);
            
            // Security check: prevent path traversal
            if (requestedPath.includes("..")) {
                return new Response("Forbidden", { status: 403 });
            }
            
            return new Response(Bun.file(`public/${requestedPath}`));
        }
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});
```

## Page Structure

Each page exports routes object:

```ts#pages/example.tsx
export const routes = {
    "/path": () => html(
        <Shell>
            {/* Page content */}
        </Shell>
    ),
    "/path/api": () => sse(/* SSE response */),
} as const;
```

## Server-Sent Events (SSE)

The SSE utilities in `src/lib/sse.ts` handle all Datastar protocol functionality:

```ts#example-sse.ts
import { sse, interval, patchElements, patchSignals, readSignals } from "./lib/sse";

// Real-time updates with server-side intervals (no client polling!)
"/api/clock": sse(async function* (req: Request, signals: Signals) {
    yield patchSignals({ time: new Date().toISOString() });
    for await (const _ of interval(1000)) {
        yield patchSignals({ time: new Date().toISOString() });
    }
}),

// Process form data
"/api/process": sse(async function* (req: Request, signals: Signals) {
    const result = signals.value * 2;
    yield patchSignals({ result });
}),

// Execute JavaScript on the client
"/api/alert": sse(async function* () {
    yield executeScript("alert('Hello!')");
})
```

## Key SSE Functions

- **`interval(ms)`** - Server-side timing, eliminates client polling
- **`patchElements(html, {selector, mode})`** - Update DOM elements
- **`patchSignals(signals)`** - Update reactive state
- **`readSignals(req)`** - Get signals from request (GET/POST/FormData)
- **`sse(async function* (req, signals) { ... })`** - Create SSE streams

## Frontend

Use HTML with direct JSX imports. Don't use `vite`. HTML imports support React, CSS, Tailwind automatically.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With JSX components:

```tsx#frontend.tsx
import React from "react";
import './index.css';
import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

## Development

- Run with `bun dev`
- Static assets from `public/` directory
- Hot reload enabled automatically
- All routing consolidated in single server file

## Important Notes

- `bun dev` is likely already running - don't execute it again
- Use `Bun.file()` for static assets with security checks
- All imports use ES modules syntax
- SSE utilities handle all Datastar protocol requirements
- Pages export route objects for clean organization
- Use `data-on-load="@get('/sse/endpoint')"` instead of client-side intervals
- Server-side `interval()` is way better than client polling
