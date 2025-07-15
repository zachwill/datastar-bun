import { html } from '../lib/sse';
import Shell from "../components/shell";

function ExampleCard({ title, description, path }: { title: string, description: string, path: string }) {
  return (
    <article style={{ marginBottom: "1rem" }}>
      <h4>
        <a href={path}>{title}</a>
      </h4>
      <p>{description}</p>
    </article>
  );
}

function FeatureList() {
  return (
    <div className="grid">
      <div>
        <h5>🚀 Server-Side Rendering</h5>
        <p>Built with Bun's lightning-fast runtime and bundler</p>
      </div>
      <div>
        <h5>⚡ Real-time Updates</h5>
        <p>Server-sent events for live data streaming</p>
      </div>
      <div>
        <h5>🎯 Declarative UI</h5>
        <p>Reactive components with simple data binding</p>
      </div>
    </div>
  );
}

export const routes = {
  "/": () => html(
    <Shell>
      <hgroup>
        <h1>Datastar + Bun</h1>
        <p>A modern full-stack framework combining Datastar's reactive frontend with Bun's backend</p>
      </hgroup>

      <hr />

      <FeatureList />

      <hr />

      <section>
        <h2>Examples</h2>
        <p>Live examples to see Datastar in action:</p>

        <div className="grid">
          <ExampleCard
            title="Counter"
            description="A simple reactive counter demonstrating state management and event handling"
            path="/counter"
          />

          <ExampleCard
            title="Slider"
            description="An animated slider with real-time updates using server-sent events"
            path="/slider"
          />

          <ExampleCard
            title="Clock"
            description="A live clock showing real-time updates from the server"
            path="/clock"
          />
        </div>

        <div className="grid">
          <ExampleCard
            title="Time Display"
            description="Multiple time formats updating in real-time"
            path="/time"
          />

          <ExampleCard
            title="Chat Demo"
            description="Real-time chat interface with live message updates"
            path="/chat"
          />
        </div>
      </section>

      <hr />

      <section>
        <h2>Getting Started</h2>
        <p>This project demonstrates the integration of:</p>
        <ul>
          <li><strong>Datastar</strong> - For reactive frontend components</li>
          <li><strong>Bun</strong> - For fast development and runtime</li>
          <li><strong>Server-Sent Events</strong> - For real-time communication</li>
          <li><strong>TypeScript</strong> - For type-safe development</li>
        </ul>
      </section>
    </Shell>
  ),
} as const;