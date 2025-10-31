import type { Metadata } from "next";
import SupportClientTeachers from "./supportClientTeachers";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Access support and help resources on Moderate Tech. Get assistance with platform features, report issues, or contact support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return (
    <>
      <SupportClientTeachers />
    </>
  );
}
