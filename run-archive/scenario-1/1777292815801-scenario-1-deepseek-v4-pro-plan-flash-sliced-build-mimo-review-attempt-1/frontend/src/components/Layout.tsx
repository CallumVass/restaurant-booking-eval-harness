import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface LayoutProps {
  currentRoute: string
  onNavigate: (route: string) => void
  children: React.ReactNode
}

function Layout({ currentRoute, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center gap-6 px-4 py-3">
          <button
            onClick={() => onNavigate('restaurants')}
            className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
            aria-label="Home"
          >
            TableBook
          </button>
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            <Button
              variant={
                currentRoute === 'restaurants' || currentRoute.startsWith('restaurant-')
                  ? 'secondary'
                  : 'ghost'
              }
              size="sm"
              onClick={() => onNavigate('restaurants')}
            >
              Restaurants
            </Button>
            <Button
              variant={currentRoute === 'bookings' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('bookings')}
            >
              Bookings
            </Button>
          </nav>
        </div>
      </header>
      <Separator />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

export default Layout
