// pattern: Imperative Shell

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface NavHeaderProps {
  isAuthenticated: boolean;
  userEmail: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function NavHeader({
  isAuthenticated,
  userEmail,
  onLoginClick,
  onLogout,
  isLoggingOut,
}: NavHeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-2xl border bg-card px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          Restaurant Booking
        </h1>
        <Badge className="bg-secondary text-secondary-foreground">
          Dinner service
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" onClick={onLoginClick}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
