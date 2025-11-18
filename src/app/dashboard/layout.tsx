"use client";

import { ReactNode, useMemo, useState, useEffect, Suspense } from "react";
import SuspenseLoading from "@/components/ui/SuspenseLoading";
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
  User,
  LogOut,
  Shield,
  BookOpen,
  AtSign,
  Flag,
  UserX,
  Scale,
  Gavel,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/DashboardShell";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SearchInputTeacher from "@/modules/dashboard/teacher/SearchInputTeacher";
import {
  getRole,
  getModerationStatus,
  setModerationStatus,
} from "@/services/tokenService";
import { performLogout } from "@/services/logoutService";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { useUserData } from "@/hooks/useUser";
import PopupCard from "@/components/PopCard";
import UserAvatar from "@/components/UserAvatar";
import {
  useUserModerationDetails,
  useUserReportStats,
} from "@/hooks/useModeration";
import ModerationWarningBanner from "@/components/ModerationWarningBanner";
import AccountSuspendedBanner from "@/components/AccountSuspendedBanner";
import NotificationBellWithPanel from "@/components/NotificationBellWithPanel";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import toast from "react-hot-toast";

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
        label: "Subject Areas",
        icon: BookOpen,
        href: "/dashboard/admin/subjects",
      },
      {
        label: "Email Domains",
        icon: AtSign,
        href: "/dashboard/admin/domains",
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
        label: "Reports",
        icon: Flag,
        href: "/dashboard/admin/reports",
      },
      {
        label: "Moderated Users",
        icon: UserX,
        href: "/dashboard/admin/moderated-users",
      },
      {
        label: "Appeals",
        icon: Scale,
        href: "/dashboard/admin/appeals",
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
    {
      label: "Appeals",
      icon: Gavel,
      href: "/dashboard/teacher/appeals",
    },
    { label: "Settings", icon: Settings, href: "/dashboard/teacher/settings" },
  ];
}

function getMobileSidebarItems(role: Role): NavItem[] {
  // Only show mobile sidebar for teachers, not admins
  if (role !== "TEACHER") {
    return []; // No mobile sidebar for admin
  }

  // Return only 4 specific items for teachers on mobile
  const allTeacherItems = getSidebarItems(role);

  const mobileItems = ["Overview", "Grading Feeds", "Messages", "Settings"];

  return allTeacherItems.filter((item) => mobileItems.includes(item.label));
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

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [query, setQuery] = useState("");
  const role = getRole() as Role;
  const profileLink =
    role === "SYSTEM_ADMIN"
      ? "/dashboard/admin/profile"
      : role === "TEACHER"
      ? "/dashboard/teacher/profile"
      : "";

  const router = useRouter();
  const { user, isLoading, isSuccess, isError, error } = useUserData();

  // Get moderation details for teachers only
  const { data: moderationData } = useUserModerationDetails(user?.id || "", {
    enabled: !!user?.id && role === "TEACHER",
  });
  const { data: reportStats } = useUserReportStats(user?.id || "", {
    enabled: !!user?.id && role === "TEACHER",
  });
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count || 0;

  // Get total unread messages count
  const { totalUnreadCount: unreadMessagesCount } = useUnreadMessages(user?.id);

  // Initialize message socket for real-time updates
  useMessageSocket({
    userId: user?.id,
    enabled: !!user?.id,
  });

  // Update moderation status in cookie when data is fetched
  useEffect(() => {
    if (moderationData?.moderation?.status && role === "TEACHER") {
      setModerationStatus(moderationData.moderation.status);
    }
  }, [moderationData?.moderation?.status, role]);

  const handleLogout = () => {
    performLogout();
    router.push("/auth/login");
  };

  // Check moderation status from cookie and API on mount and when data changes
  // Force logout if banned, show banner if suspended/pending_review
  useEffect(() => {
    if (user?.id && role === "TEACHER") {
      const cookieStatus = getModerationStatus();
      const apiStatus = moderationData?.moderation?.status;

      // Use API status if available, otherwise fall back to cookie
      const currentStatus = apiStatus || cookieStatus;

      // Force logout if banned
      if (currentStatus === "banned") {
        toast.error("Your account has been banned. You have been logged out.");
        performLogout();
        router.push("/auth/login");
        return;
      }

      // Update cookie with latest status from API
      if (apiStatus && apiStatus !== cookieStatus) {
        setModerationStatus(apiStatus);
      }
    }
  }, [user?.id, moderationData?.moderation?.status, role, router]);

  const menuItems = [
    {
      label: "Profile",
      icon: <User size={22} />,
      onClick: () => {
        setIsPopUpOpen(false);
        router.push(profileLink);
      },
    },
    // { label: "Settings", onClick: () => router.push("/settings") },
    { label: "Logout", icon: <LogOut size={22} />, onClick: handleLogout },
  ];

  const sidebarItems = useMemo(() => {
    const items = getSidebarItems(role);
    // Add badge count to Messages item
    return items.map((item) => {
      if (item.label === "Messages" && role === "TEACHER") {
        return { ...item, badgeCount: unreadMessagesCount };
      }
      return item;
    });
  }, [role, unreadMessagesCount]);

  const mobileSidebarItems = useMemo(() => {
    const items = getMobileSidebarItems(role);
    // Add badge count to Messages item
    return items.map((item) => {
      if (item.label === "Messages" && role === "TEACHER") {
        return { ...item, badgeCount: unreadMessagesCount };
      }
      return item;
    });
  }, [role, unreadMessagesCount]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = getDashboardTitle(pathname, role, sidebarItems);

  // Check if we're on a detail page (messages detail, announcement detail, etc.) - MOBILE ONLY
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isDetailPage = useMemo(() => {
    // Only hide layout on mobile
    if (!isMobile) return false;

    const hasChatId = searchParams.has("chatId");
    const hasAnnouncementId = searchParams.has("id");

    // Check if pathname indicates detail view
    const isPostDetail =
      pathname.includes("/grading/") &&
      pathname !== "/dashboard/teacher/grading";
    const isMessagesDetail = pathname.includes("/messages") && hasChatId;
    const isAnnouncementDetail =
      pathname.includes("/announcements") && hasAnnouncementId;

    return isPostDetail || isMessagesDetail || isAnnouncementDetail;
  }, [pathname, searchParams, isMobile]);

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
          className="relative flex flex-row gap-2 cursor-pointer"
          onClick={() => setIsPopUpOpen(true)}
        >
          {/* 
           USER PROFILE
            */}
          <div className=" flex flex-col justify-center items-center  w-[51px] h-[51px] rounded-full bg-white">
            <UserAvatar
              profilePictureUrl={user?.profilePictureUrl || ""}
              name={user?.name}
              size="md"
            />
          </div>

          <div className="flex flex-col gap-[4px] ">
            <div className="flex items-center gap-1.5">
              <span className="font-base font-medium text-[#0C0C0C] ">
                {user?.name}
              </span>
              {role === "SYSTEM_ADMIN" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#2997F1]/10 text-[#2997F1] rounded text-[10px] font-medium">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <span className="text-sm font-normal text-[#717171]">
              {user?.email}
            </span>
          </div>

          {/* Dropdown Card */}
          <PopupCard
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            align="right"
          >
            <div className="flex flex-col ">
              {menuItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    item.onClick();
                    setIsPopUpOpen(false);
                  }}
                  className="flex flex-row items-center gap-3 px-5 py-3 text-left text-[15px] text-gray-800  font-medium rounded-lg transition-all duration-200 hover:bg-gray-50  hover:text-blue-600  group"
                >
                  <span className="text-gray-500  group-hover:text-blue-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </PopupCard>
        </div>{" "}
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
        <NotificationBellWithPanel
          customIcon={
            <div className="flex justify-center items-center cursor-pointer w-[44px] h-[44px] rounded-full bg-white relative">
              <Bell className="w-5.5 h-5.5 text-[#0C0C0C]" />
            </div>
          }
        />
        <div
          className="relative flex flex-row gap-2 cursor-pointer"
          onClick={() => setIsPopUpOpen(true)}
        >
          {/* 
           USER PROFILE
            */}
          <div className=" flex flex-col justify-center items-center  w-[51px] h-[51px] rounded-full bg-white">
            <UserAvatar
              profilePictureUrl={user?.profilePictureUrl || ""}
              name={user?.name}
              size="md"
            />
          </div>

          <div className="flex flex-col gap-[4px] ">
            <div className="flex items-center gap-1.5">
              <span className="font-base font-medium text-[#0C0C0C] ">
                {user?.name}
              </span>
              {role === "SYSTEM_ADMIN" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#2997F1]/10 text-[#2997F1] rounded text-[10px] font-medium">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <span className="text-sm font-normal text-[#717171]">
              {user?.email}
            </span>
          </div>

          {/* Dropdown Card */}
          <PopupCard
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            align="right"
          >
            <div className="flex flex-col ">
              {menuItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    item.onClick();
                    setIsPopUpOpen(false);
                  }}
                  className="flex flex-row items-center gap-3 px-5 py-3 text-left text-[15px] text-gray-800  font-medium rounded-lg transition-all duration-200 hover:bg-gray-50  hover:text-blue-600  group"
                >
                  <span className="text-gray-500  group-hover:text-blue-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </PopupCard>
        </div>{" "}
      </div>
    );
  };

  // Hide dashboard layout for detail pages on mobile
  if (isDetailPage) {
    return <>{children}</>;
  }

  return (
    <>
      <AccountSuspendedBanner />
      <DashboardShell
        title={title}
        sidebarItems={sidebarItems}
        mobileSidebarItems={mobileSidebarItems}
        onSearchChange={() => {}}
        rightContent={
          role === "SYSTEM_ADMIN" ? adminRightContent() : userRightContent()
        }
        place={role === "SYSTEM_ADMIN" ? "SYSTEM_ADMIN" : "TEACHER"}
      >
        {/* Moderation Warning Banner for Teachers */}
        {role === "TEACHER" &&
          moderationData?.moderation &&
          ((moderationData.moderation.status === "active" &&
            moderationData.moderation.violationCount > 0) ||
            moderationData.moderation.status === "suspended" ||
            moderationData.moderation.status === "banned" ||
            moderationData.moderation.status === "pending_review") && (
            <div className="px-4 md:px-6 pt-4">
              <ModerationWarningBanner
                moderation={moderationData.moderation}
                reportStats={reportStats}
              />
            </div>
          )}
        {children}
      </DashboardShell>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<SuspenseLoading fullscreen message="Loading dashboard..." />}
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
