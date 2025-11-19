import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
// import { queryClient } from "@/lib/queryClient";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://moderatetech.co.uk"
  ),
  title: {
    default: "Moderate Tech - Modern Test Moderation Platform",
    template: "%s | Moderate Tech",
  },
  description:
    "A dedicated test moderation platform built for teachers at any educational level. Review, grade, and moderate assessments collaboratively with streamlined tools for feedback and quality assurance.",
  keywords: [
    "test moderation",
    "assessment review",
    "teacher grading platform",
    "exam moderation",
    "education quality assurance",
    "teacher collaboration",
    "grading workflow",
  ],
  authors: [{ name: "Moderate Tech" }],
  creator: "Moderate Tech",
  publisher: "Moderate Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Moderate Tech",
    title: "Moderate Tech - Modern Test Moderation Platform",
    description:
      "Purpose-built software for teachers to moderate tests, standardize grading, and collaborate across educational institutions.",
    images: [
      {
        url: "/images/ModerateTech-Grading-Page-Favorites-Filter.png",
        width: 1200,
        height: 630,
        alt: "Moderate Tech dashboard showing grading and favorites filter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moderate Tech - Modern Test Moderation Platform",
    description:
      "Purpose-built software for teachers to moderate tests, standardize grading, and collaborate across educational institutions.",
    images: ["/images/ModerateTech-Grading-Page-Favorites-Filter.png"],
    creator: "@moderatetech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#F1F1F1]">
      <body className={`${outfit.className} antialiased`}>
        <ReactQueryProvider>
          <div className="max-w-[1840px] mx-auto ">{children}</div>
          <Toaster position="top-center" />
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
