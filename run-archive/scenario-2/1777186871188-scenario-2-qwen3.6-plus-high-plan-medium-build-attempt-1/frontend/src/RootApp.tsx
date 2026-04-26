// pattern: Imperative Shell

import { AuthProvider } from "./components/AuthProvider.tsx";
import { useAuthProvider } from "./hooks/useAuthProvider.ts";
import App from "./App.tsx";

export default function RootApp() {
  const auth = useAuthProvider();
  return (
    <AuthProvider value={auth}>
      <App />
    </AuthProvider>
  );
}
