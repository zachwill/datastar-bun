export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Datastar + Bun</title>
        <link rel="stylesheet" href="/public/style.css" />

        <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@main/bundles/datastar.js" />
      </head>

      <body>
        <aside id="sidebar">
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/chat">Chat</a></li>
              <li><a href="/counter">Counter</a></li>
              <li><a href="/clock">Clock</a></li>
              <li><a href="/slider">Slider</a></li>
              <li><a href="/time">Time</a></li>
            </ul>
          </nav>
        </aside>

        <main id="document">
          <div id="content">
            {children}
          </div>
          <div data-class-no-scroll="$navOpen"></div>
        </main>
      </body>
    </html >
  );
}