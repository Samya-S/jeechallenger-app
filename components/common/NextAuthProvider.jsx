"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

// 1. Create the AuthGuardian right here in the same file
function AuthGuardian({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    // If the backend flags the user as deleted, force the logout
    if (session?.error === "UserDeleted") {
      signOut({ callbackUrl: '/ai-tutor' });
    }
  }, [session]);

  return <>{children}</>;
}

// 2. Update your main export to wrap children with the Guardian
export default function NextAuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthGuardian>
        {children}
      </AuthGuardian>
    </SessionProvider>
  );
}