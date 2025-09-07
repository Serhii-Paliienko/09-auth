"use client";

import Link from "next/link";
import css from "./Header.module.css";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.startsWith("/notes");

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.headerLink}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link
              href="/"
              className={css.navigationLink}
              aria-current={isHome ? "page" : undefined}
            >
              Home
            </Link>
          </li>
          <li className={css.navigationItem}>
            <TagsMenu />
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
