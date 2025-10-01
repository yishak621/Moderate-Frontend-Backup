import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Moderate Tech",
  description:
    "A modern platform for schools to manage students, teachers, and learning effectively.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
          <ReactQueryDevtools initialIsOpen={false} />;
        </ReactQueryProvider>
      </body>
    </html>
  );
}
