import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'font-semibold text-jp-green' : 'text-stone-600 hover:text-jp-green'}`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-jp-ivory text-stone-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-jp-ivory/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-black tracking-tight text-xl text-jp-green">Jack & Paws</Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <NavLink className={navClass} to="/pets">Find pets</NavLink>
            <NavLink className={navClass} to="/how-it-works">How it works</NavLink>
            <NavLink className={navClass} to="/about">About</NavLink>
            {user ? (
              <>
                <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>
                <button className="text-sm font-semibold text-stone-600 hover:text-jp-orange" onClick={() => { logout(); navigate('/'); }}>Sign out</button>
              </>
            ) : (
              <NavLink className={navClass} to="/login">Sign in</NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-stone-200 bg-stone-100/70">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <strong className="text-lg text-jp-green">Jack & Paws</strong>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">A practical adoption platform built around finding the right home for the right pet.</p>
          </div>
          <div className="grid content-start gap-2 text-sm">
            <Link className="hover:text-jp-orange" to="/pets">Find a pet</Link>
            <Link className="hover:text-jp-orange" to="/about">About</Link>
            <Link className="hover:text-jp-orange" to="/how-it-works">How adoption works</Link>
          </div>
          <div className="grid content-start gap-2 text-sm text-stone-500">
            <span>Built with React + Spring Boot + MySQL</span>
            <span>© 2026 Jack & Paws</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
