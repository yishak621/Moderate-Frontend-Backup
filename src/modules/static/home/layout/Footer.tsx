import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { id: 1, href: "/about", label: "About" },
  { id: 2, href: "/contact", label: "Contact" },
  { id: 3, href: "/privacy-policy", label: "Privacy Policy" },
  { id: 4, href: "/terms-and-conditions", label: "Terms and Conditions" },
  { id: 5, href: "/eula", label: "EULA" },
  { id: 6, href: "/disclaimer", label: "Disclaimer" },
  { id: 7, href: "/acceptable-use", label: "Acceptable Use" },
  { id: 8, href: "/impressum", label: "Impressum" },
];

export default function Footer() {
  return (
    <footer className="w-full pt-8 sm:pt-10 md:pt-12 pb-8 ">
      <div className="flex flex-col min-h-[200px] sm:min-h-[240px] md:min-h-[360px]">
        {/* Links section */}
        <div className="flex flex-wrap flex-row justify-center items-center gap-4 px-2 sm:gap-6 md:gap-8 lg:gap-[50px] mb-6 sm:mb-8">
          {links.map((link) => (
            <Link
              className="text-[#797979] text-xs sm:text-sm md:text-base font-medium hover:text-blue-600 transition-colors"
              key={link.id}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social media section */}
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-[20px]">
          <SocialMediaLinkItem
            href="https://www.facebook.com"
            icon={<FacebookIcon />}
            label="Facebook"
          />
          <SocialMediaLinkItem
            href="https://www.twitter.com"
            icon={<TwitterIcon />}
            label="Twitter"
          />
          <SocialMediaLinkItem
            href="https://www.instagram.com"
            icon={<InstagramIcon />}
            label="Instagram"
          />
          <SocialMediaLinkItem
            href="https://www.linkedin.com"
            icon={<LinkedinIcon />}
            label="Linkedin"
          />
          <SocialMediaLinkItem
            href="https://www.youtube.com"
            icon={<YoutubeIcon />}
            label="Youtube"
          />
        </div>
      </div>

      {/* Copyright section */}
      <div className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 text-center">
        <p className="text-[#838383] text-xs sm:text-sm md:text-[14px] font-medium">
          © 2025 Moderate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function SocialMediaLinkItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex justify-center items-center bg-[#F3F3F3] rounded-full p-3 sm:p-3.5 md:p-4 lg:p-4.5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg transform hover:-translate-y-1"
      aria-label={label}
    >
      <div className="text-[#797979] group-hover:text-white transition-colors duration-300 transform group-hover:rotate-12">
        {icon}
      </div>
    </Link>
  );
}
