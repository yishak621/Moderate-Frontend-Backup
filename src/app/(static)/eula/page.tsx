import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "End User License Agreement (EULA)",
  description:
    "Review the End User License Agreement for Moderate Tech, outlining rights, restrictions, and usage terms for our applications.",
  keywords: [
    "End User License Agreement",
    "EULA",
    "software license",
    "Moderate Tech terms",
    "education platform EULA",
  ],
  openGraph: {
    title: "EULA | Moderate Tech",
    description:
      "Understand the End User License Agreement governing your use of Moderate Tech’s platform and services.",
    url: "/eula",
  },
  alternates: {
    canonical: "/eula",
  },
};

export default function EULAPage() {
  return (
    <LegalPage
      title="End User License Agreement (EULA)"
      description="This End User License Agreement governs your use of our application and services."
      termlyId="a0ae604c-7f4e-4ed1-beee-1213dc091cae"
    />
  );
}
