import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Restaurants' },
  { to: '/bookings', label: 'My Bookings' },
]

function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-foreground">
            Restaurant Bookings
          </Link>
          <nav aria-label="Main navigation">
            <ul className="flex gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
