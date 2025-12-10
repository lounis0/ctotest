import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <section className="card">
    <h2>Page not found</h2>
    <p>The page you tried to reach does not exist yet. Head back to the dashboard.</p>
    <Link to="/">Go home</Link>
  </section>
);
