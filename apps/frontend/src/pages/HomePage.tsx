export const HomePage = () => {
  return (
    <section className="card">
      <h2>Welcome 👋</h2>
      <p>
        This shell pairs a TypeScript Express backend and a Vite-powered React frontend. Use the
        navigation links above to explore the scaffolded routes and start building features.
      </p>
      <p>
        Backend health check available at <code>/health</code> and exposed through the Docker
        network for local testing.
      </p>
    </section>
  );
};
