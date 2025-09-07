import type { Metadata } from "next";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { getMeServer } from "@/lib/api/serverApi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "View your profile information in NoteHub.",
  openGraph: { title: "Profile Page", description: "Your NoteHub profile" },
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "https://ac.goit.global/fullstack/react/default-avatar.jpg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
