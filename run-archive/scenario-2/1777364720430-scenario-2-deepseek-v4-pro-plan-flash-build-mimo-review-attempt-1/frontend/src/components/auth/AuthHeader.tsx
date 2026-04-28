// pattern: Imperative Shell

import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";

interface AuthHeaderProps {
  email: string;
  onLogout: () => void;
  onShowLogin: () => void;
  isAuthenticated: boolean;
}

export function AuthHeader({
  email,
  onLogout,
  onShowLogin,
  isAuthenticated,
}: AuthHeaderProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <User data-icon="inline-start" />
          {email}
        </span>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut data-icon="inline-start" />
          Log out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={onShowLogin}>
      <User data-icon="inline-start" />
      Sign in
    </Button>
  );
}
