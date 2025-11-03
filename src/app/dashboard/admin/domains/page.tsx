import type { Metadata } from "next";
import DomainsClient from "./domainsClient";

export const metadata: Metadata = {
  title: "School Email Domains",
  description:
    "Manage allowed email domains for teacher registration. Control which school email addresses can create accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <>
      <DomainsClient />
    </>
  );
}
