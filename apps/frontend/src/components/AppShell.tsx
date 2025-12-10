import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : undefined;

export const AppShell = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
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
          {isAuthenticated && user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <span className="user-name">Welcome, {user.firstName || user.email}</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </>
          )}
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
};
