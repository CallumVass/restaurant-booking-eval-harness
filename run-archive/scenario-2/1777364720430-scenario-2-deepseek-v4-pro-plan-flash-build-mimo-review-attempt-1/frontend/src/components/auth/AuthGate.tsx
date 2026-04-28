// pattern: Imperative Shell

import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function AuthGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Book a table</CardTitle>
        <CardDescription>
          Sign in to book a table at your favorite restaurant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onSignIn}>
          <Clock data-icon="inline-start" />
          Sign in to book
        </Button>
      </CardContent>
    </Card>
  );
}
