"use client";

import { ReactNode } from "react";
import StaticLayout from "./StaticLayout";
import PageHeader from "./PageHeader";

interface StaticPageClientProps {
  title: string;
  pathname: string;
  children: ReactNode;
}

export default function StaticPageClient({
  title,
  pathname,
  children,
}: StaticPageClientProps) {
  return (
    <StaticLayout>
      <div className="py-20 w-full">
        <PageHeader title={title} pathname={pathname} />
        {children}
      </div>
    </StaticLayout>
  );
}
