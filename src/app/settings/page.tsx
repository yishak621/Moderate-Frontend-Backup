import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your Moderate Tech account settings, preferences, and profile information.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Settings | Moderate Tech",
    description: "Manage your Moderate Tech account settings and preferences.",
    url: "/settings",
  },
  alternates: {
    canonical: "/settings",
  },
};

export default function page() {
  return <div>settings</div>;
}
