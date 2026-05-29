// Route the iframe to use CircuitVerse's embed mode, which:
// - Does NOT require API authentication
// - Has a simpler setup (no toolbar height calculation)
// - Uses embed.vue component which directly calls setup()
export default function Workbench() {
  return (
    <iframe
      // Using the embed path - the Vue router will match /embed/:projectId?
      // and render embed.vue which initializes the simulator without API auth
      src="/circuitverse/index.html#/embed"
      className="block w-full min-h-[100svh] border-none"
      style={{
        border: "none",
        display: "block"
      }}
      title="CircuitVerse Simulator"
      allow="fullscreen"
    />
  );
}
