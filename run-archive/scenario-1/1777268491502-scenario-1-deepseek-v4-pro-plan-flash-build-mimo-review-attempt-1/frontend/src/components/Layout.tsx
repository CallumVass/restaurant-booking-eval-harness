import { Outlet, Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Restaurants' },
  { to: '/book', label: 'Book a Table' },
  { to: '/bookings', label: 'My Bookings' },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            TableMate
          </Link>
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-white ${
                  pathname === link.to
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
