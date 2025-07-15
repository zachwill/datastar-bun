export default () => (
  <>
    <h1>Clock</h1>
    <h2 id="server-time"
      {...{
        "data-on-interval__duration.1s.leading": "@get('/api/clock')",
        "data-on-signal-patch": "el.textContent = patch.clock"
      }}>
      --:--:--
    </h2>
  </>
);