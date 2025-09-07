"use client";

import Link from "next/link";
import css from "./AuthNavigation.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe, logoutUser } from "@/lib/api/clientApi";
import { useEffect } from "react";

export default function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      getMe()
        .then(setUser)
        .catch(() => {});
    }
  }, [isAuthenticated, user, setUser]);

  const handleLogout = async () => {
    await logoutUser();
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
              aria-current={pathname.startsWith("/profile") ? "page" : undefined}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email ?? "User email"}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
              aria-current={pathname === "/sign-in" ? "page" : undefined}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
              aria-current={pathname === "/sign-up" ? "page" : undefined}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
