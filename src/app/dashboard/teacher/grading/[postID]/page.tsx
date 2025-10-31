import type { Metadata } from "next";
import PostViewClient from "./postViewClient";

export const metadata: Metadata = {
  title: "Grading Post",
  description:
    "Grade student work on Moderate Tech. Review and evaluate student submissions for this post.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <PostViewClient />
    </>
  );
}
