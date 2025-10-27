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
  { id: 2, href: "/about", label: "About" },
  { id: 3, href: "/contact", label: "Contact" },
  { id: 4, href: "/privacy", label: "Privacy Policy" },
  { id: 5, href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="  w-full">
      {/* Links section */}
      <div className=" flex flex-row justify-center items-center gap-[50px]">
        {links.map((link) => (
          <Link
            className="text-[#797979] text-base font-medium hover:text-blue-600 transition-colors"
            key={link.id}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Social media section */}
      <div className=" flex flex-row justify-center items-center gap-[20px]">
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
      className="group flex justify-center items-center sm:mt-[50px] 2xl:mt-[70px] bg-[#F3F3F3] rounded-full p-4.5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg transform hover:-translate-y-1"
      aria-label={label}
    >
      <div className="text-[#797979] group-hover:text-white transition-colors duration-300 transform group-hover:rotate-12">
        {icon}
      </div>
    </Link>
  );
}
