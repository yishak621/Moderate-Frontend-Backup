"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StatusCircle from "@/modules/dashboard/teacher/StatusCircle";

interface GuideItem {
  id: number;
  title: string;
  videoUrl?: string;
  description: string;
  links?: { label: string; href: string }[];
}

const guideItems: GuideItem[] = [
  {
    id: 1,
    title: "How to Upload a Document",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Controls what users can do after authentication through three main models: RBAC assigns permissions to roles, ABAC uses attributes and context for fine-grained control, and ACL attaches permissions to individual resources. Real applications like GitHub and Stripe often combine these models. OAuth2 enables delegated authorization without sharing credentials, while JWTs and bearer tokens carry user identity and permissions across systems. The key is choosing the right combination of models and mechanisms based on your application's complexity.",
    links: [{ label: "View Upload Guide", href: "#" }],
  },
  {
    id: 2,
    title: "Grading System Explained",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Real applications like GitHub and Stripe often combine these models. OAuth2 enables delegated authorization without sharing credentials, while JWTs and bearer tokens carry user identity and permissions across systems. The key is choosing the right combination of models and mechanisms based on your application's complexity.",
    links: [
      { label: "Grading Docs", href: "#" },
      { label: "Best Practices", href: "#" },
    ],
  },
  {
    id: 3,
    title: "Sharing with Students",
    description:
      "Learn how to securely share exam results and resources directly with students.",
  },
];

export default function GuideClient() {
  const [selected, setSelected] = useState<GuideItem | null>(guideItems[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-6">
      {/* Left sidebar */}
      <div className="bg-[#FDFDFD] flex flex-col rounded-2xl p-6 shadow-sm min-h-screen">
        <Link
          href={"/dashboard/teacher/support"}
          className="text-[#0C0C0C] text-xl font-medium flex flex-row items-center gap-2.5 mb-8 hover:text-[#368FFF] transition"
        >
          <ArrowLeft size={21} /> Learn More
        </Link>

        <div className="flex flex-col gap-4">
          {guideItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={` flex flex-row items-center text-left gap-2.5 font-normal px-4 py-3 rounded-xl transition-all cursor-pointer ${
                selected?.id === item.id
                  ? "bg-[#368FFF] text-white"
                  : "hover:bg-[#EDEDED] text-[#717171]"
              }`}
            >
              <StatusCircle
                color={selected?.id === item.id ? "bg-white" : "bg-transparent"}
              />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="bg-[#FDFDFD] rounded-2xl p-6 shadow-sm">
        {selected ? (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-[#0C0C0C]">
              {selected.title}
            </h2>

            {selected.videoUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow">
                <iframe
                  src={selected.videoUrl}
                  title={selected.title}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <p className="text-[#717171] text-base leading-relaxed">
              {selected.description}
            </p>

            {selected.links && (
              <div className="flex flex-wrap gap-3">
                {selected.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-[#368FFF] border border-[#368FFF] rounded-full hover:bg-[#368FFF] hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-[#717171] text-base">Select an item to view</p>
        )}
      </div>
    </div>
  );
}
