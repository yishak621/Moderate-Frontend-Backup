"use client";

import { ReactNode, useMemo } from "react";
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
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/DashboardShell";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Role = "admin" | "teacher";

function getSidebarItems(role: Role): NavItem[] {
  if (role === "admin") {
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
    { label: "Grades", icon: FileText, href: "/dashboard/teacher/grades" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
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
  // TODO: replace with real role from auth/user state
  const role: Role = "admin";

  const sidebarItems = useMemo(() => getSidebarItems(role), [role]);
  const pathname = usePathname();
  const title = getDashboardTitle(pathname, role, sidebarItems);

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

        <div className=" flex flex-row gap-2">
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
              Admin user
            </span>
            <span className="text-sm font-normal text-[#717171]">
              admin@school.com
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardShell
      title={title}
      sidebarItems={sidebarItems}
      onSearchChange={() => {}}
      rightContent={role === "admin" ? adminRightContent() : "dasda"}
      place={role === "admin" ? "admin" : "teacher"}
    >
      {children}
    </DashboardShell>
  );
}
