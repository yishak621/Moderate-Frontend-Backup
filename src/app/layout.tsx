import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
// import { queryClient } from "@/lib/queryClient";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://moderatetech.co.uk"),
  title: {
    default: "Moderate Tech - Modern School Management Platform",
    template: "%s | Moderate Tech",
  },
  description:
    "A modern platform for schools to manage students, teachers, and learning effectively. Streamline your educational institution with comprehensive tools for grading, announcements, messaging, and more.",
  keywords: [
    "school management",
    "education platform",
    "student management",
    "teacher dashboard",
    "grading system",
    "school administration",
    "learning management",
    "educational technology",
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
    title: "Moderate Tech - Modern School Management Platform",
    description:
      "A modern platform for schools to manage students, teachers, and learning effectively.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moderate Tech - School Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moderate Tech - Modern School Management Platform",
    description:
      "A modern platform for schools to manage students, teachers, and learning effectively.",
    images: ["/og-image.jpg"],
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
