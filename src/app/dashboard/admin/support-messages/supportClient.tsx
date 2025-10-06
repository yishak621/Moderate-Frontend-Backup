"use client";

import StatsCard from "@/modules/dashboard/StatsCards";
import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getAnnouncementColumns } from "./columns";
import Modal from "@/components/ui/Modal";

import {
  Inbox,
  Plus,
  Send,
  UserPlus,
  RefreshCw,
  CheckCircle,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";
import { Announcement } from "@/app/types/announcement";
import SearchInput from "@/components/ui/SearchInput";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import { Support } from "@/app/types/support";
import SupportMessageModal from "@/modules/dashboard/admin/modal/support/SupportMessageModal";
import { StatsCardProps } from "@/types/statusCardProps";

const statsData: StatsCardProps[] = [
  { title: "Total Tickets", count: 243, colored: true, icon: Ticket },
  { title: "Open", count: 45, icon: Inbox },
  { title: "In Progress", count: 1847, icon: RefreshCw },
  { title: "Resolved", count: 1847, icon: CheckCircle },
];

export const sampleData: Support[] = [
  {
    id: "1",
    subject: "Login not working",
    user: {
      id: "101",
      email: "zara@asdas.com",
      name: "Alice Johnson",
      role: "Student",
    },
    type: "System",
    status: "Opened",
    messages: 3,
    last_reply: "2025-09-20T10:45:00Z",
    created: new Date("2025-09-18T08:30:00Z"),
  },
  {
    id: "2",
    subject: "Request for dark mode",
    user: {
      id: "102",
      email: "zara@asdas.com",

      name: "Mark Thompson",
      role: "Teacher",
    },
    type: "Feature",
    status: "In_progress",
    messages: 5,
    last_reply: "2025-09-21T14:20:00Z",
    created: new Date("2025-09-19T09:10:00Z"),
  },
  {
    id: "3",
    subject: "General inquiry about grading system",
    user: {
      id: "103",
      email: "zara@asdas.com",

      name: "Sophia Lee",
      role: "Admin",
    },
    type: "General",
    status: "Resolved",
    messages: 2,
    last_reply: "2025-09-15T12:00:00Z",
    created: new Date("2025-09-14T11:15:00Z"),
  },
];

export default function SupportClient() {
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

  const No_Of_tickets = 5;

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
              colored={stat.colored}
              icon={stat.icon}
            />
          );
        })}
      </div>

      {/* medium section */}
      <div className="flex flex-row items-end  gap-4.5  w-full py-[30px] px-6 rounded-[22px] bg-[#FDFDFD]">
        <div className="basis-3/4 ">
          <SearchInput
            label="Search Users"
            placeholder="search by name and email"
            onSearch={(val) => console.log("Searching:", val)}
            error=""
          />
        </div>
        <div className="basis-1/4 ">
          <div>
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Filter by Curricular Area
            </p>{" "}
            <CustomMultiSelect
              placeholder="All Curricular Area"
              options={options}
              onChange={handleSelected}
            />
          </div>
        </div>
      </div>
      {/* bottom part */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] h-screen overflow-scroll">
        {/* table header */}
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[#0C0C0C] text-xl font-medium">
              {`Support Tickets(${No_Of_tickets})`}
            </p>
            <p className="text-[#717171] text-base font-normal">
              Manage user support requests and communications
            </p>
          </div>

          <Button
            icon={<Send size={23} />}
            onClick={() => handleOpenModal(SupportMessageModal)}
          >
            Send Messages
          </Button>
        </div>

        {/* table */}
        <div className="px-0 p-6">
          <DataTable<Support> data={sampleData} columns={columns} />
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
