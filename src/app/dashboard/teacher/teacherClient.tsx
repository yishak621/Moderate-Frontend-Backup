"use client";

import Modal from "@/components/ui/Modal";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
import DashboardNotificationItem from "@/modules/dashboard/admin/DashboardNotificationItem";
import DashboardButton from "@/modules/dashboard/DashboardButton";
import StatsCard from "@/modules/dashboard/StatsCards";
import { Megaphone, MessagesSquare, PlusSquare } from "lucide-react";
import { useState } from "react";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/CreateNewAnnouncementModal";
import { StatsCardProps } from "@/types/statusCardProps";
import SectionHeader from "@/components/SectionHeader";
import { FilterButtons } from "@/components/ui/FilterButtons";
import Post from "@/modules/dashboard/teacher/PostSection";
import { PostAttributes } from "@/types/postAttributes";
import CreatPostModal from "@/modules/dashboard/teacher/post/CreatPostModal";

const statsData: StatsCardProps[] = [
  {
    title: "Posts Created",
    count: 24,
    description: "+12% from last month",
    colored: true,
  },
  {
    title: "Document Moderated ",
    count: 45,
    description: "+2 from last month",
    colored: false,
  },
  {
    title: "Documents Uploaded",
    count: 1847,
    description: "+12% from last month",
    colored: false,
  },
];

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

export const samplePosts: PostAttributes[] = [
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "Introduction to Algorithms",
    posted_by: "Prof. Thomas",
    uploaded_at: "2025-09-25",
    files: [
      "https://arxiv.org/pdf/2111.01147.pdf", // sample CS research paper
      "https://www.gutenberg.org/files/84/84-pdf.pdf", // Frankenstein (public domain)
    ],
    post_tags: ["Algorithms", "CS", "Education"],
    post_status: "published",
    post_grade_avg: 4.5,
  },
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "Modern Physics Basics",
    posted_by: "Dr. Einstein",
    uploaded_at: "2025-09-20",
    files: [
      "https://arxiv.org/pdf/quant-ph/0410100.pdf", // quantum mechanics paper
    ],
    post_tags: ["Physics", "Quantum", "Education"],
    post_status: "draft",
    post_grade_avg: 4.2,
  },
  {
    id: "Dd3f32fhfvg3fvb3f",
    name_of_post: "Public Speaking Guide",
    posted_by: "Ms. Johnson",
    uploaded_at: "2025-09-15",
    files: [
      "https://www.gutenberg.org/files/16317/16317-pdf.pdf", // Dale Carnegie-like public domain text
    ],
    post_tags: ["Soft Skills", "Communication"],
    post_status: "archived",
    post_grade_avg: 3.9,
  },
];
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

  return (
    <div className="flex flex-col gap-5.5">
      {/* first section */}
      <div className="flex flex-row gap-6  rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7 ">
        {statsData.map((stat) => {
          return (
            <StatsCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              description={stat.description}
            />
          );
        })}
      </div>

      <div className="min-h-screen rounded-[37px] bg-[#FDFDFD] p-6 max-w-full overflow-hidden ">
        <div className="grid gap-6 md:grid-cols-[65%_35%] grid-cols-1">
          {/* left side */}
          <div className="p-6 w-full">
            {/* left top */}
            <div className="flex flex-row justify-between mb-5 flex-wrap">
              <SectionHeader
                title="Recent Uploads from Your School"
                subheader="Documents uploaded by teachers in your domain"
              />

              <div>
                <FilterButtons
                  filters={filters}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>
            </div>

            {/* left bottom */}
            <div className="w-full overflow-x-auto">
              {samplePosts.map((post, idx) => {
                return <Post post={post} key={idx} />;
              })}
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
