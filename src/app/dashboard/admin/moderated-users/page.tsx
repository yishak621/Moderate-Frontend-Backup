import type { Metadata } from "next";
import ModeratedUsersClient from "./moderatedUsersClient";

export const metadata: Metadata = {
  title: "Moderated Users",
  description:
    "Manage moderated users on Moderate Tech. View suspended, banned, and pending review users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <ModeratedUsersClient />
    </>
  );
}

