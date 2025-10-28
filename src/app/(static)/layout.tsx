"use client";

import Navbar from "@/modules/static/home/layout/Navbar";
import Footer from "@/modules/static/home/layout/Footer";
import CTASection from "@/modules/static/home/sections/CTASection";

interface StaticLayoutProps {
  children: React.ReactNode;
}

export default function StaticLayout({ children }: StaticLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff]">
      <Navbar />
      <main className="flex-1 w-full px-1 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {children}
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}
