// pattern: Imperative Shell

import { LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";

interface NavHeaderProps {
  tab: "restaurants" | "my-bookings";
  onTabChange: (tab: "restaurants" | "my-bookings") => void;
  onSignIn: () => void;
}

export function NavHeader({ tab, onTabChange, onSignIn }: NavHeaderProps) {
  const { auth, logout } = useAuth();
  const isAuthenticated = auth.status === "authenticated";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onTabChange("restaurants")}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          TableForge
        </button>

        <nav className="flex items-center gap-4 text-sm">
          <button
            onClick={() => onTabChange("restaurants")}
            className={
              tab === "restaurants"
                ? "font-medium text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Restaurants
          </button>
          {isAuthenticated && (
            <button
              onClick={() => onTabChange("my-bookings")}
              className={
                tab === "my-bookings"
                  ? "font-medium text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              My Bookings
            </button>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {auth.status === "loading" ? null : isAuthenticated ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                <User data-icon="inline-start" className="size-3.5" />
                {auth.status === "authenticated" && auth.user.displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut data-icon="inline-start" className="size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onSignIn}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
