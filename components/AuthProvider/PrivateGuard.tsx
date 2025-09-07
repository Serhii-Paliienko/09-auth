"use client";
import { useEnsureAuth } from "./AuthProvider";

export default function PrivateGuard({ children }: { children: React.ReactNode }) {
  const ok = useEnsureAuth();
  if (!ok) return null;
  return <>{children}</>;
}
