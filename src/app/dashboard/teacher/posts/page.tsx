import type { Metadata } from "next";
import PostsClientTeachers from "./postsClientTeachers";

export const metadata: Metadata = {
  title: "My Posts",
  description:
    "Manage your posts on Moderate Tech. Create, edit, and view all your educational posts and content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <PostsClientTeachers />
    </>
  );
}
