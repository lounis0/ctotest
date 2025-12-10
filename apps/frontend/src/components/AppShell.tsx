import { Link, NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : undefined;

export const AppShell = () => (
  <div className="app-shell">
    <header>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <h1>Monorepo Starter</h1>
      </Link>
      <p>Express + React playground with batteries included.</p>
      <nav>
        <NavLink to="/" className={navLinkClass} end>
          Home
        </NavLink>
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
      </nav>
    </header>
    <main className="app-shell__main">
      <Outlet />
    </main>
    <footer>
      <small>API base: {import.meta.env.VITE_API_BASE_URL || 'not configured'}</small>
    </footer>
  </div>
);
