// pattern: Imperative Shell

import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../lib/auth-context";

interface UserMenuProps {
  onSignIn: () => void;
}

export function UserMenu({ onSignIn }: UserMenuProps) {
  const auth = useAuth();

  if (auth.authLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/20" />
        <span>Loading...</span>
      </div>
    );
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User size={16} />
          {auth.user.email}
        </span>
        <Button variant="outline" size="sm" onClick={auth.logout}>
          <LogOut size={14} />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={onSignIn}>
      Sign in
    </Button>
  );
}
