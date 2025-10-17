"use client";

import Modal from "@/components/ui/Modal";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
import DashboardNotificationItem from "@/modules/dashboard/admin/DashboardNotificationItem";
import DashboardButton from "@/modules/dashboard/DashboardButton";
import StatsCard from "@/modules/dashboard/StatsCards";
import { Megaphone, MessagesSquare, PlusSquare } from "lucide-react";
import { useState } from "react";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/announcements/CreateNewAnnouncementModal";
import { StatsCardProps } from "@/types/statusCardProps";
import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";
import { useUserOverviewStatsData, useUserPostFeeds } from "@/hooks/useUser";
import Button from "@/components/ui/Button";
import Link from "next/link";

const notifications = [
  {
    statusColor: "bg-green-500",
    title: "New Grading Guidelines Released",
    time: "2 minutes ago",
  },
  {
    statusColor: "bg-yellow-500",
    title: "Assignment pending approval: math101",
    time: "10 minutes ago",
  },
];

const buttonData = [
  {
    icon: <PlusSquare width={23} height={23} />,
    label: "New Post",
    component: CreatPostModal,
  },
  {
    icon: <MessagesSquare width={23} height={23} />,
    label: "Messages",
    component: AddTeacherModal,
  },
  {
    icon: <Megaphone width={23} height={23} />,
    label: "More Announcements",
    component: CreateNewAnnouncementModal,
  },
];

// export const samplePosts: PostAttributes[] = [
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "Introduction to Algorithms",
//     posted_by: "Prof. Thomas",
//     uploaded_at: "2025-09-25",
//     files: [
//       "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
//       "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
//     ],
//     post_tags: ["Algorithms", "CS", "Education"],
//     post_status: "published",
//     post_grade_avg: 4.5,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "Modern Physics Basics",
//     posted_by: "Dr. Einstein",
//     uploaded_at: "2025-09-20",
//     files: [
//       "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
//     ],
//     post_tags: ["Physics", "Quantum", "Education"],
//     post_status: "draft",
//     post_grade_avg: 4.2,
//   },
//   {
//     id: "Dd3f32fhfvg3fvb3f",
//     name_of_post: "Public Speaking Guide",
//     posted_by: "Ms. Johnson",
//     uploaded_at: "2025-09-15",
//     files: [
//       "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
//     ],
//     post_tags: ["Soft Skills", "Communication"],
//     post_status: "archived",
//     post_grade_avg: 3.9,
//   },
// ];
//--------------------------OVERVIEW DASHBOARD
export default function UserClient() {
  //MODAL STATES
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC | null>(null);

  const handleOpenModal = (Component: React.FC) => {
    setModalComponent(() => Component); // store the component to render
    setOpen(true);
  };

  const filters = ["All", "Moderated", "Pending"];
  const [activeFilter, setActiveFilter] = useState("All"); // ✅ default "All"

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

  const overViewPosts = [
    userPostFeedsData?.posts[0],
    userPostFeedsData?.posts[1],

    userPostFeedsData?.posts[2],
  ];
  console.log(overViewPosts);
  const statsData: StatsCardProps[] = [
    {
      title: "Posts Created",
      count: userOverviewStatsData?.data.postCount || 0,
      description: "0% from last month",
      colored: true,
    },
    {
      title: "Posts Moderated ",
      count: userOverviewStatsData?.data.moderatedCount || 0,
      description: "0 from last month",
      colored: false,
    },
    {
      title: "Documents Uploaded",
      count: userOverviewStatsData?.data.uploadCount || 0,
      description: "0% from last month",
      colored: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5.5">
      {/* first section */}
      <div className="flex flex-row gap-6  rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7 ">
        {statsData?.map((stat) => {
          return (
            <StatsCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              description={stat.description}
              colored={stat.colored}
            />
          );
        })}
      </div>

      <div className="min-h-screen rounded-[37px] bg-[#FDFDFD] p-6 max-w-full overflow-hidden ">
        <div className="grid gap-6 md:grid-cols-[70%_30%] grid-cols-1">
          {/* left side */}
          <div className="p-6 w-full">
            {/* left top */}
            <div className="flex flex-row justify-between mb-5 flex-wrap">
              <SectionHeader
                title="Recent Moderation Posts from Schools & Teachers You Follow"
                subheader="Follow teachers and classmates to see their latest moderation posts in one place."
              />

              {/* <div>
                <FilterButtons
                  filters={filters}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div> */}
            </div>

            {/* left bottom */}
            <div className="w-full overflow-x-auto">
              {!userPostFeedsData?.posts ? (
                // Loading skeleton
                <div className="flex flex-col gap-2 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded" />
                  <div className="h-24 bg-gray-200 rounded" />
                  <div className="h-24 bg-gray-200 rounded" />
                </div>
              ) : userPostFeedsData?.posts.length === 0 ? (
                // No posts state
                <div className="flex flex-col items-center justify-center mt-8 py-16 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-4">
                  <svg
                    className="w-16 h-16 text-gray-400"
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

                  <h3 className="text-lg font-semibold text-gray-700">
                    No posts available
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    Posts will appear here once available. Be the first to
                    create a post!
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
                  {" "}
                  <Button className="w-full" variant="secondary">
                    View More Posts
                  </Button>{" "}
                </Link>
              )}
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col gap-8 w-full">
            {/* right title block */}
            <div className="flex flex-col gap-2 ">
              <p className="text-[#0C0C0C] text-xl font-medium">
                Recent Announcements
              </p>
              <p className="text-[#717171] font-normal text-base">
                Latest system events and user actions
              </p>
            </div>

            {/* right bottom */}
            <div className="flex flex-col gap-6  overflow-hidden">
              {notifications.map((item, idx) => (
                <DashboardNotificationItem
                  key={idx}
                  statusColor={item.statusColor}
                  title={item.title}
                  time={item.time}
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOOTM */}
        <div className="pt-15 flex flex-row gap-7 justify-between">
          {buttonData.map((btn, idx) => (
            <DashboardButton
              key={idx}
              icon={btn.icon}
              label={btn.label}
              onClick={() => handleOpenModal(btn.component!)}
            />
          ))}
          {/* VERY IMPORTANT */}
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent />}{" "}
              {/* render dynamic component */}
            </Modal.Content>
          </Modal>
        </div>
      </div>
    </div>
  );
}
