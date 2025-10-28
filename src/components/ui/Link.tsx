"use client";

import Link from "next/link";
import clsx from "clsx";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-[#368FFF] text-sm font-semibold sm:text-base hover:underline hover:text-blue-800 transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}
