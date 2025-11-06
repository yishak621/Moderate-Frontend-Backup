import type { Metadata } from "next";
import { Suspense } from "react";
import PostsClientTeachers from "./postsClientTeachers";
import SuspenseLoading from "@/components/ui/SuspenseLoading";

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
    <Suspense fallback={<SuspenseLoading fullscreen message="Loading posts, please wait..." />}>
      <PostsClientTeachers />
    </Suspense>
  );
}
