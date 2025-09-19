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

type Role = "admin" | "teacher";

function getSidebarItems(role: Role): NavItem[] {
  if (role === "admin") {
    return [
      { label: "Overview", icon: ChartColumn, href: "/dashboard/admin" },
      { label: "User Management", icon: Users, href: "/dashboard/admin/users" },
      {
        label: "Curricular Area",
        icon: Globe,
        href: "/dashboard/admin/curricular-area-management",
      },
      {
        label: "Announcements",
        icon: Megaphone,
        href: "/dashboard/announcements",
      },
      {
        label: "Support Messages",
        icon: Mail,
        href: "/dashboard/support-messages",
      },
      { label: "App Settings", icon: Settings, href: "/dashboard/settings" },
    ];
  }
  return [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/teacher" },
    { label: "Grades", icon: FileText, href: "/dashboard/teacher/grades" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // TODO: replace with real role from auth/user state
  const role: Role = "admin";

  const sidebarItems = useMemo(() => getSidebarItems(role), [role]);

  const adminRightContent = () => {
    return (
      <div className="flex flex-row gap-4 ">
        <div className=" flex justify-center items-center w-[44px] h-[44px] rounded-full bg-white relative">
          <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
          <div className=" absolute bottom-0 right-0 w-[15px] h-[15px] bg-[#368FFF] rounded-full"></div>
        </div>

        <div className=" flex flex-row gap-2">
          <div className=" flex flex-col justify-center items-center w-[51px] h-[51px] rounded-full bg-white">
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
      title="Dashboard"
      sidebarItems={sidebarItems}
      onSearchChange={() => {}}
      rightContent={role === "admin" ? adminRightContent() : "dasda"}
      place={role === "admin" ? "admin" : "teacher"}
    >
      {children}
    </DashboardShell>
  );
}
