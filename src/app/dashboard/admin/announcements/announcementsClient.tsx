"use client";

import StatsCard from "@/modules/dashboard/StatsCards";
import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getAnnouncementColumns } from "./columns";
import Modal from "@/components/ui/Modal";

import {
  CheckCircle,
  Eye,
  Plus,
  UserPlus,
  Megaphone,
  Loader,
} from "lucide-react";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Announcement } from "@/app/types/announcement";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/announcements/CreateNewAnnouncementModal";
import { useAdminAllAnnouncementsData } from "@/hooks/UseAdminRoutes";
import { StatsCardProps } from "@/types/statusCardProps";

export default function AnnouncementClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    allAnnouncements,
    isAnnouncementsLoading,
    isAnnouncementsSuccess,
    isAnnouncementsError,
  } = useAdminAllAnnouncementsData(page);

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

  const totalAnnouncements = allAnnouncements?.meta.total;
  const publishedAnnouncements = allAnnouncements?.meta.total;
  const views = allAnnouncements?.meta.total;

  const statsData: StatsCardProps[] = [
    {
      title: "Total Announcement",
      count: totalAnnouncements,
      colored: true,
      icon: Megaphone,
    },
    { title: "Published", count: publishedAnnouncements, icon: CheckCircle },
    { title: "Total Views", count: 1847, icon: Eye },
  ];

  useEffect(() => {
    setTotalPages(allAnnouncements?.meta.totalPages);
  }, [isAnnouncementsSuccess, allAnnouncements]);

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
              description={stat?.description}
              colored={stat?.colored}
              icon={stat?.icon}
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
          {isAnnouncementsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : (
            <DataTable<Announcement>
              data={allAnnouncements?.data || []}
              columns={columns}
            />
          )}
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </Modal.Content>
          </Modal>
        </div>

        {/* pagination buttons */}
        <div className="flex flex-row gap-2 justify-self-end">
          <div className="flex gap-2 mt-4 items-center">
            {/* Back button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border-0 text-[#717171] disabled:opacity-50 transition-colors duration-300 hover:text-blue-500 cursor-pointer"
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
              className="px-3 py-1 border-0 text-[#717171] disabled:opacity-50 transition-colors duration-300 hover:text-blue-500 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
