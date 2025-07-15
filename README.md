# Datastar + Bun Examples

A collection of simple examples demonstrating how to use [Datastar](https://github.com/starfederation/datastar) with [Bun](https://bun.sh/) for building reactive web applications.

## What is Datastar?

Datastar is a hypermedia-driven framework that brings reactive frontend capabilities to server-rendered applications. It allows you to build interactive web apps using declarative HTML attributes and server-side rendering.

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

This project includes several interactive examples:

- **Welcome** (`/`) - Homepage with project information
- **App Shell** (`/app`) - Demonstration of a complete app layout with toggleable sections
- **Counter** (`/counter`) - Simple counter with increment/decrement buttons
- **Chat** (`/chat`) - Real-time chat example using Server-Sent Events
- **Clock** (`/clock`) - Live updating clock display
- **Slider** (`/slider`) - Interactive slider component
- **Time** (`/time`) - Time display examples

## Project Structure

```
src/
├── server.ts          # Main server file with routing
├── components/        # Reusable components
│   └── shell.tsx     # App shell wrapper
├── lib/              # Utility libraries
│   ├── expr.ts       # Datastar expression helpers
│   ├── html.ts       # HTML response utilities
│   └── sse.ts        # Server-Sent Events utilities
└── pages/            # Individual page examples
    ├── app.tsx       # App shell demo
    ├── chat.tsx      # Chat example
    ├── clock.tsx     # Clock example
    ├── counter.tsx   # Counter example
    ├── slider.tsx    # Slider example
    ├── time.tsx      # Time example
    └── welcome.tsx   # Welcome page
```

## How It Works

Each page demonstrates different Datastar features:

- **Reactive Data Binding** - Using `data-text` and `data-signals` attributes
- **Event Handling** - Using `data-on-click` and other event attributes
- **Server-Sent Events** - Real-time updates from server to client
- **Expression Language** - Datastar's reactive expression system

## Development

- The server uses Bun's built-in hot reload (`--hot` flag)
- Static assets are served from the `public/` directory
- All routing is handled in `src/server.ts`

## Learn More

- [Datastar Documentation](https://github.com/starfederation/datastar)
- [Bun Documentation](https://bun.sh/docs)