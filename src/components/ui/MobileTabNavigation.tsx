"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  route: string;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  activeTab?: string;
}

export default function MobileTabNavigation({
  tabs,
  activeTab,
}: MobileTabNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab from pathname or prop
  const currentActiveTab =
    activeTab ||
    tabs.find((tab) => pathname.includes(tab.route))?.id ||
    tabs[0]?.id;

  const activeIndex = tabs.findIndex((tab) => tab.id === currentActiveTab);

  const handleTabClick = (tab: Tab) => {
    router.push(tab.route);
  };

  return (
    <div className="flex gap-0 px-4 relative border-b border-gray-200">
      {tabs.map((tab, index) => {
        const isActive = tab.id === currentActiveTab;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
              isActive
                ? "text-[#0C0C0C]"
                : "text-[#717171] hover:text-[#0C0C0C]"
            }`}
          >
            {tab.label}
            {/* Animated underline */}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0C0C0C]"
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

