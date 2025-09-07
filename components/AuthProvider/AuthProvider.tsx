"use client";

import { useEffect, useState } from "react";
import { getMe, getSession, logoutUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session.success) {
          const me = await getMe();
          setUser(me);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setChecking(false);
      }
    })();
  }, [setUser, clearIsAuthenticated]);

  if (checking) return <div style={{ padding: 16 }}>Checking session…</div>;
  return <>{children}</>;
}

export function useEnsureAuth() {
  const { isAuthenticated } = useAuthStore();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (!s.success) {
        await logoutUser();
        setOk(false);
      } else {
        setOk(true);
      }
    })();
  }, []);

  return isAuthenticated && ok;
}
