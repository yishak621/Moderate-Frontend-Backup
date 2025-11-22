"use client";

import Modal from "@/components/ui/Modal";
import DashboardButton from "@/modules/dashboard/DashboardButton";
import StatsCard from "@/modules/dashboard/StatsCards";
import MobileStatsCards from "@/modules/dashboard/MobileStatsCards";
import {
  Megaphone,
  HelpCircle,
  PlusSquare,
  Filter,
  FileText,
  Star,
  Upload,
} from "lucide-react";
import { useState } from "react";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/announcements/CreateNewAnnouncementModal";
import NewTicketModal from "@/modules/dashboard/teacher/supportMessages/NewTicketModal";
import { StatsCardProps } from "@/types/statusCardProps";
import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";
import SectionLoading from "@/components/SectionLoading";
import {
  useUserOverviewStatsData,
  useUserPostFeeds,
  useAllAnnouncementsData,
  useUserData,
} from "@/hooks/useUser";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AnnouncementBox from "@/modules/dashboard/teacher/AnnouncementsBox";
import { Announcement } from "@/app/types/announcement";
import { useRouter } from "next/navigation";
import ResponsiveModal from "@/components/ui/ResponsiveModal";

const buttonData = [
  {
    icon: (
      <PlusSquare width={20} height={20} className="sm:w-[23px] sm:h-[23px]" />
    ),
    label: "New Post",
    component: CreatPostModal,
  },
  {
    icon: (
      <Megaphone width={20} height={20} className="sm:w-[23px] sm:h-[23px]" />
    ),
    label: "Create Announcement",
    component: CreateNewAnnouncementModal,
  },
  {
    icon: (
      <HelpCircle width={20} height={20} className="sm:w-[23px] sm:h-[23px]" />
    ),
    label: "Support Ticket",
    component: NewTicketModal,
  },
];

//--------------------------OVERVIEW DASHBOARD
export default function UserClient() {
  //MODAL STATES
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC | null>(null);
  const router = useRouter();

  const handleOpenModal = (Component: React.FC) => {
    setModalComponent(() => Component); // store the component to render
    setOpen(true);
  };

  //HOOKS
  const {
    userOverviewStatsData,
    isUserOverviewStatsDataLoading,
    isUserOverviewStatsDataSuccess,
    isUserOverviewStatsError,
    isUserOverviewStatsDataError,
  } = useUserOverviewStatsData();

  const {
    userPostFeedsData,
    isUserPostFeedsDataError,
    isUserPostFeedsDataLoading,
    isUserPostFeedsDataSuccess,
    isUserPostFeedsError,
  } = useUserPostFeeds();

  const { user } = useUserData();

  const {
    AllAnnouncements,
    isLoading: isAnnouncementsLoading,
    isSuccess: isAnnouncementsSuccess,
  } = useAllAnnouncementsData();

  // Get 3 latest announcements
  const latestAnnouncements = AllAnnouncements?.data?.slice(0, 3) || [];

  const overViewPosts = [
    userPostFeedsData?.posts[0],
    userPostFeedsData?.posts[1],
    userPostFeedsData?.posts[2],
  ];

  const statsData: StatsCardProps[] = [
    {
      title: "Posts Created",
      count: userOverviewStatsData?.data.postCount || 0,
      description: "0% from last month",
      colored: true,
      children: (
        <Button
          variant="black"
          className="w-full"
          onClick={() => router.push("/dashboard/teacher/posts")}
        >
          <FileText className="w-3 h-3 text-[#FDFDFD]" />
          <span className="text-[12.94px] font-normal text-[#FDFDFD]">
            View Posts
          </span>
        </Button>
      ),
    },
    {
      title: "Posts Moderated ",
      count: userOverviewStatsData?.data.moderatedCount || 0,
      description: "0 from last month",
      colored: false,
      children: (
        <Button
          variant="black"
          className="w-full"
          onClick={() => router.push("/dashboard/teacher/grading")}
        >
          <Star className="w-3 h-3 text-[#FDFDFD]" />
          <span className="text-[12.94px] font-normal text-[#FDFDFD]">
            Grade Now
          </span>
        </Button>
      ),
    },
    {
      title: "Documents Uploaded",
      count: userOverviewStatsData?.data.uploadCount || 0,
      description: "0% from last month",
      colored: false,
      children: (
        <Button
          variant="black"
          className="w-full"
          onClick={() => handleOpenModal(CreatPostModal)}
        >
          <Upload className="w-3 h-3 text-[#FDFDFD]" />
          <span className="text-[12.94px] font-normal text-[#FDFDFD]">
            Upload
          </span>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
      {/* Stats Cards - Responsive */}
      <div className="relative">
        {/* Desktop Stats */}
        <div className="hidden sm:p-[26px] md:flex gap-4 bg-[#FDFDFD] sm:rounded-[37px] w-full">
          {statsData?.map((stat, index) => (
            <div key={stat.title} className="flex-1">
              <StatsCard
                title={stat.title}
                count={stat.count}
                description={stat.description}
                colored={stat.colored}
              />
            </div>
          ))}
        </div>

        {/* Mobile Stats with Swipe */}
        <div className="md:hidden">
          <MobileStatsCards stats={statsData || []} />
        </div>
      </div>

      {/* Recent Posts Section - Desktop with Announcements */}
      <div className="hidden md:flex bg-[#FDFDFD] rounded-[20px] sm:rounded-[24px] min-h-screen h-screen w-full max-w-full overflow-hidden">
        {/* Recent Posts - Left Side (Scrollable) */}
        <div className="flex-[60%] min-h-screen p-4 sm:p-6 overflow-y-scroll scrollbar-hide flex flex-col">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recent Posts
            </h2>
          </div>

          {/* Posts List - Scrollable */}
          <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
            {isUserPostFeedsDataLoading ? (
              <SectionLoading />
            ) : !isUserPostFeedsDataLoading &&
              userPostFeedsData?.posts.length === 0 ? (
              // No posts state - only show after loading completes
              <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-700">
                  No posts available
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Posts will appear here once available. Be the first to create
                  a post!
                </p>
              </div>
            ) : (
              // Render posts
              overViewPosts?.map((post: PostAttributes, idx: number) => (
                <Post post={post} key={idx} />
              ))
            )}

            {userPostFeedsData?.posts.length > 0 && (
              <Link href={"/dashboard/teacher/grading"}>
                <Button className="w-full" variant="secondary">
                  View More Posts
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Announcements - Right Side (Fixed Height, Desktop Only) */}
        <div className="flex-[40%] p-4 sm:p-6 overflow-y-scroll scrollbar-hide flex flex-col">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recent Announcements
            </h2>
          </div>

          {/* Announcements List */}
          <div className="space-y-4 flex-1">
            {isAnnouncementsLoading ? (
              // Loading skeleton
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg" />
                <div className="h-20 bg-gray-200 rounded-lg" />
                <div className="h-20 bg-gray-200 rounded-lg" />
              </div>
            ) : latestAnnouncements.length === 0 ? (
              // No announcements state
              <div className="flex flex-col items-center justify-center py-8 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                <p className="text-sm text-gray-500 text-center">
                  No announcements available
                </p>
              </div>
            ) : (
              // Render announcements
              latestAnnouncements.map(
                (announcement: Announcement, idx: number) => (
                  <Link
                    href={"/dashboard/teacher/announcements"}
                    className="block mb-4"
                    key={announcement.id || idx}
                  >
                    <AnnouncementBox
                      announcement={announcement}
                      selectedId=""
                      onClick={() => {}}
                    />
                  </Link>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Recent Posts Section - Mobile Only */}
      <div className="md:hidden   sm:rounded-[24px] p-4 sm:p-6 w-full max-w-full overflow-hidden">
        {/* Section Header with View More Button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-sm font-medium sm:text-xl  text-[#0C0C0C]">
            Recent Posts
          </h2>
          {userPostFeedsData?.posts.length > 0 && (
            <Link
              href={"/dashboard/teacher/grading"}
              className="text-sm font-normal text-[#717171]"
            >
              See All
            </Link>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {isUserPostFeedsDataLoading ? (
            <SectionLoading />
          ) : !isUserPostFeedsDataLoading &&
            userPostFeedsData?.posts.length === 0 ? (
            // No posts state - only show after loading completes
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-base font-semibold text-gray-700">
                No posts available
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Posts will appear here once available. Be the first to create a
                post!
              </p>
            </div>
          ) : (
            // Render posts
            overViewPosts?.map((post: PostAttributes, idx: number) => (
              <Post post={post} key={idx} />
            ))
          )}
        </div>
      </div>

      {/* Action Buttons - Mobile Layout */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
        {buttonData.map((btn, idx) => (
          <DashboardButton
            key={idx}
            icon={btn.icon}
            label={btn.label}
            onClick={() => handleOpenModal(btn.component!)}
          />
        ))}
      </div>

      {/* Modal */}
      <ResponsiveModal isOpen={open} onOpenChange={setOpen}>
        <Modal.Content>{ModalComponent && <ModalComponent />}</Modal.Content>
      </ResponsiveModal>
    </div>
  );
}
