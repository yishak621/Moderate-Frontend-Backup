"use client";

import StatsCard from "@/modules/dashboard/StatsCards";
import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getAnnouncementColumns } from "./columns";
import Modal from "@/components/ui/Modal";

import { Plus, UserPlus } from "lucide-react";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
import { useState } from "react";
import type { ComponentType } from "react";
import { Announcement } from "@/app/types/announcement";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/CreateNewAnnouncementModal";

type StatsCardProps = {
  title: string;
  count: number;
  description: string;
};

const statsData: StatsCardProps[] = [
  {
    title: "Total Teachers",
    count: 243,
    description: "+12% from last month",
  },
  {
    title: "Active Schools",
    count: 45,
    description: "+2 from last month",
  },
  {
    title: "Documents Uploaded",
    count: 1847,
    description: "+12% from last month",
  },
];

export const sampleData: Announcement[] = [
  {
    title: "New Feature Release",
    content: "New Feature Release hdasd in this week",
    type: "Feature",
    priority: "High",
    audience: "All Users",
    status: "Published",
    views: 1245,
    published: "2025-09-10",
  },
];
export default function AnnouncementClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };

  const No_Of_Users = 5;

  const handleOpenModal = (
    component: React.FC<unknown>,
    props: unknown = {}
  ) => {
    setModalComponent(() => component);
    setModalProps(props);
    setOpen(true);
  };

  const columns = getAnnouncementColumns(
    handleOpenModal as <P>(component: ComponentType<P>, props?: P) => void
  );

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
      {/* bottom part */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] h-screen overflow-scroll">
        {/* table header */}
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[#0C0C0C] text-xl font-medium">
              All Announcements
            </p>
            <p className="text-[#717171] text-base font-normal">
              Manage your platform announcements and notifications
            </p>
          </div>

          <Button
            icon={<Plus size={23} />}
            onClick={() => handleOpenModal(CreateNewAnnouncementModal)}
          >
            Create Announcement
          </Button>
        </div>

        {/* table */}
        <div className="px-0 p-6">
          <DataTable<Announcement> data={sampleData} columns={columns} />
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </Modal.Content>
          </Modal>
        </div>

        {/* pagination buttons */}
        <div className=" flex flex-row gap-2 border border-red-500 absolute bottom-0 right-0">
          {/* Pagination */}
          <div className="flex gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Back
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  p === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
