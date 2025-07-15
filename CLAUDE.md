---
description: Development guide for the Datastar + Bun examples project
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

# Datastar + Bun Development Guide

This project demonstrates how to use Datastar with Bun for building reactive web applications.

## Project Setup

Default to using Bun instead of Node.js for all operations:

- Use `bun run dev` to start the development server with hot reload
- Use `bun run start` for production mode
- Use `bun install` for dependencies
- Use `bun test` for running tests

## Server Architecture

The server uses `Bun.serve()` with a routes object pattern:

```ts
serve({
    port: 5555,
    development: { hmr: true, console: true },
    routes: {
        ...Welcome.routes,
        ...App.routes,
        ...Chat.routes,
        // ... other route modules
    },
    fetch() { return new Response("Not found", { status: 404 }); },
});
```

## Page Structure

Each page follows this pattern:

```ts
export const routes = {
  "/path": () => html(
    <Shell>
      {/* Page content */}
    </Shell>
  ),
} as const;
```

## Datastar Integration

- Use `data-signals` attribute for reactive state
- Use `data-text` for text binding
- Use `data-on-click` and similar for event handling
- Use Server-Sent Events for real-time updates

## Key APIs Used

- `Bun.serve()` for the web server with built-in routing
- `Bun.file()` for serving static assets
- Built-in WebSocket support for real-time features
- React/JSX for server-side rendering

## File Organization

```
src/
├── server.ts          # Main server with consolidated routing
├── components/        # Reusable UI components
├── lib/              # Utilities (html, sse, expr)
└── pages/            # Individual page examples
```

## Development Workflow

1. Server runs with `bun --hot src/server.ts`
2. Static assets served from `public/` directory
3. All routing handled in single `server.ts` file
4. Pages export route objects for clean organization

## Important Notes

- The dev server is already running - no need to start it manually
- Static files are served via the `/public/*` route
- All imports use ES modules syntax
- Hot reload is enabled for development
