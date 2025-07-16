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
        <p>Built with Bun and TypeScript</p>
      </div>
      <div>
        <h5>⚡ Real-time Updates</h5>
        <p>SSE with no client polling</p>
      </div>
      <div>
        <h5>🎯 Simple Reactive UI</h5>
        <p>Datastar handles all reactivity</p>
      </div>
    </div>
  );
}

export const routes = {
  "/": html(
    <Shell>
      <hgroup>
        <h1>Datastar + Bun</h1>
        <p>Real-time web apps with server-sent events and no client-side frameworks</p>
      </hgroup>

      <hr />

      <FeatureList />

      <hr />

      <section>
        <h2>Examples</h2>
        <p>Here's what you can build:</p>

        <div className="grid">
          <ExampleCard
            title="Counter"
            description="Simple +/- counter"
            path="/counter"
          />

          <ExampleCard
            title="Slider"
            description="Animated slider with server-side intervals"
            path="/slider"
          />

          <ExampleCard
            title="Clock"
            description="Live clock updates from server"
            path="/clock"
          />
        </div>

        <div className="grid">
          <ExampleCard
            title="Time Display"
            description="Different time formats updating in real-time"
            path="/time"
          />

          <ExampleCard
            title="Chat Demo"
            description="Real-time chat with live message updates"
            path="/chat"
          />
        </div>
      </section>

      <hr />

      <section>
        <h2>How it works</h2>
        <p>This project uses:</p>
        <ul>
          <li><strong>Datastar</strong> - HTML attributes for reactivity</li>
          <li><strong>Bun</strong> - Fast runtime and bundler</li>
          <li><strong>Server-Sent Events</strong> - Real-time updates</li>
          <li><strong>TypeScript</strong> - Type safety</li>
        </ul>
        <p>No client-side JavaScript framework needed. The server handles timing with <code>interval()</code> instead of client polling.</p>
      </section>
    </Shell>
  ),
} as const;