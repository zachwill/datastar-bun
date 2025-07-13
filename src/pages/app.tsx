export default () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Datastar AppShell</title>
        <link rel="stylesheet" href="/public/app.css" />

        <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@main/bundles/datastar.js" />
      </head>

      <body className="app" data-signals="{headerOpen: true, footerOpen: true, navbarOpen: true, asideOpen: true}">
        <header data-with-border>
          Header |
          <button data-on-click="$headerOpen = !$headerOpen">toggle</button>
        </header>

        <nav data-with-border>
          <button data-on-click="$navbarOpen = !$navbarOpen">close nav</button>
          <section>Menu A</section>
          <section data-grow>Menu B (grows)</section>
          <section>Menu C</section>
        </nav>

        <main>
          <p>
            <button data-on-click="$footerOpen = !$footerOpen">Toggle footer</button>
          </p>
          <p>(long, scrollable content ...)</p>
        </main>

        <aside data-with-border>
          <button data-on-click="$asideOpen = !$asideOpen">close aside</button>
          Aside content
        </aside>

        <footer data-with-border>
          Footer
        </footer>
      </body>

    </html>
  );
}