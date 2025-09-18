"use client";

import { ReactNode, useMemo } from "react";
import { LayoutDashboard, Settings, Users, FileText } from "lucide-react";
import DashboardShell, { NavItem } from "@/components/DashboardShell";

type Role = "admin" | "teacher";

function getSidebarItems(role: Role): NavItem[] {
  if (role === "admin") {
    return [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
      { label: "User Management", icon: Users, href: "/dashboard/admin/users" },
      {
        label: "Curricular Area",
        icon: FileText,
        href: "/dashboard/admin/reports",
      },
      { label: "Announcements", icon: Settings, href: "/dashboard/settings" },
      {
        label: "Support Messages",
        icon: Settings,
        href: "/dashboard/settings",
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

  return (
    <DashboardShell
      title="Dashboard"
      sidebarItems={sidebarItems}
      onSearchChange={() => {}}
      rightContent={<div>User Menu</div>}
      place={role === "admin" ? "admin" : "teacher"}
    >
      {children}
    </DashboardShell>
  );
}
