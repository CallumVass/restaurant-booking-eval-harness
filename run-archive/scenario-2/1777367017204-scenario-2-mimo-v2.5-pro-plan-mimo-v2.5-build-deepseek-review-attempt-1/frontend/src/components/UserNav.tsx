// pattern: Imperative Shell

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type UserNavProps = {
  email: string;
  onLogout: () => void;
  isPending: boolean;
};

export function UserNav({ email, onLogout, isPending }: UserNavProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{email}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onLogout}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : null}
        Sign out
      </Button>
    </div>
  );
}
