"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  ChartColumn,
  Globe,
  Megaphone,
  Mail,
  Star,
  MessageSquare,
  History,
  CircleQuestionMark,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/DashboardShell";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SearchInputTeacher from "@/modules/dashboard/teacher/SearchInputTeacher";
import { getRole, removeToken } from "@/services/tokenService";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { useUserData } from "@/hooks/useUser";

type Role = "SYSTEM_ADMIN" | "TEACHER";

function getSidebarItems(role: Role): NavItem[] {
  if (role === "SYSTEM_ADMIN") {
    return [
      {
        label: "Overview",
        icon: ChartColumn,
        href: "/dashboard/admin",
      },
      { label: "User Management", icon: Users, href: "/dashboard/admin/users" },
      {
        label: "Curricular Area Management",
        icon: Globe,
        href: "/dashboard/admin/curricular",
      },
      {
        label: "Announcements",
        icon: Megaphone,
        href: "/dashboard/admin/announcements",
      },
      {
        label: "Support Messages",
        icon: Mail,
        href: "/dashboard/admin/support-messages",
      },
      {
        label: "App Settings",
        icon: Settings,
        href: "/dashboard/admin/settings",
      },
    ];
  }
  return [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/teacher" },
    { label: "Grading Feeds", icon: Star, href: "/dashboard/teacher/grading" },
    { label: "My Posts", icon: FileText, href: "/dashboard/teacher/posts" },

    {
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/teacher/messages",
    },

    {
      label: "Announcements",
      icon: Megaphone,
      href: "/dashboard/teacher/announcements",
    },
    { label: "History", icon: History, href: "/dashboard/teacher/history" },
    {
      label: "Support",
      icon: CircleQuestionMark,
      href: "/dashboard/teacher/support",
    },

    { label: "Settings", icon: Settings, href: "/dashboard/teacher/settings" },
  ];
}

function getDashboardTitle(
  pathname: string,
  role: Role,
  sidebarItems: NavItem[]
) {
  // Find the exact match in sidebar items
  const match = sidebarItems.find((item) => item.href === pathname);
  if (match) return match.label;

  // fallback: if nested route, find parent match
  const parentMatch = sidebarItems.find((item) =>
    pathname.startsWith(item.href + "/")
  );
  if (parentMatch) return parentMatch.label;

  // default title
  return "Dashboard";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const role = getRole() as Role;

  const router = useRouter();
  const { user, isLoading, isSuccess, isError, error } = useUserData();

  console.log("user", user);
  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  const menuItems = [
    // { label: "Profile", onClick: () => router.push("/profile") },
    { label: "Settings", onClick: () => router.push("/settings") },
    { label: "Logout", onClick: handleLogout },
  ];

  const sidebarItems = useMemo(() => getSidebarItems(role), [role]);
  const pathname = usePathname();
  const title = getDashboardTitle(pathname, role, sidebarItems);

  const handleSearch = () => {
    console.log("Searching for:", query);
    // Call API or filter list
  };

  const adminRightContent = () => {
    return (
      <div className="flex flex-row gap-4 ">
        {/* 
            NOTIFICATION
            */}
        <div className=" flex justify-center items-center cursor-pointer w-[44px] h-[44px] rounded-full bg-white relative">
          <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
          <div className=" absolute bottom-0 right-0 w-[15px] h-[15px] bg-[#368FFF] rounded-full"></div>
        </div>
        <div
          className=" flex flex-row gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {/* 
           USER PROFILE
            */}
          <div className=" flex flex-col justify-center items-center  w-[51px] h-[51px] rounded-full bg-white">
            <Image
              className="w-11 h-11 rounded-full  border-2 border-[#368FFF] object-cover"
              src="/images/sample-user.png"
              alt="sample user image"
              width={44}
              height={44}
            />
          </div>

          <div className="flex flex-col gap-[5px] ">
            <span className="font-base font-medium text-[#0C0C0C] ">
              {user?.name}
            </span>
            <span className="text-sm font-normal text-[#717171]">
              {user?.email}
            </span>
          </div>
        </div>{" "}
        {/* Dropdown card */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-[45px] mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="flex flex-col py-2">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      item.onClick();
                      setOpen(false); // close dropdown after click
                    }}
                    className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-800 w-full"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const userRightContent = () => {
    return (
      <div className=" flex flex-row items-center gap-4 ">
        <div>
          <SearchInputTeacher
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="Search users..."
          />
        </div>
        {/* 
            NOTIFICATION
            */}
        <div className=" flex justify-center items-center cursor-pointer w-[44px] h-[44px] rounded-full bg-white relative">
          <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
          <div className=" absolute bottom-0 right-0 w-[15px] h-[15px] bg-[#368FFF] rounded-full"></div>
        </div>

        <div
          className="relative flex flex-row gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {/* 
           USER PROFILE
            */}
          <div className=" flex flex-col justify-center items-center cursor-pointer w-[51px] h-[51px] rounded-full bg-white">
            <Image
              className="w-11 h-11 rounded-full  border-2 border-[#368FFF] object-cover"
              src="/images/sample-user.png"
              alt="sample user image"
              width={44}
              height={44}
            />
          </div>

          <div className="flex flex-col gap-[5px] ">
            <span className="font-base font-medium text-[#0C0C0C] ">
              {user?.name}
            </span>
            <span className="text-sm font-normal text-[#717171]">
              {user?.email}
            </span>
          </div>
          {/* Dropdown card */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-[45px] mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="flex flex-col py-2">
                  {menuItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.onClick();
                        setOpen(false); // close dropdown after click
                      }}
                      className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-800 w-full"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };
  return (
    <DashboardShell
      title={title}
      sidebarItems={sidebarItems}
      onSearchChange={() => {}}
      rightContent={
        role === "SYSTEM_ADMIN" ? adminRightContent() : userRightContent()
      }
      place={role === "SYSTEM_ADMIN" ? "SYSTEM_ADMIN" : "TEACHER"}
    >
      {children}
    </DashboardShell>
  );
}
