import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <div className="max-w-[1440px] mx-auto ">{children}</div>
      </body>
    </html>
  );
}
