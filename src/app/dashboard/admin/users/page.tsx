"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import SearchInput from "@/components/ui/SearchInput";

import { getUserColumns } from "./columns";
import Modal from "@/components/ui/Modal";
import { User } from "./columns";

import { Eye, Pencil, Settings, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";

// interface User {
//   id: string;
//   name: string;
//   role?: string;
//   status?: string;
//   email: string;
// }

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const users: User[] = [
  {
    id: "sdfs",
    name: "John Doe",
    email: "john@school.com",
    curricular: "Mathematics",
    status: "Active",
    subscription: "Monthly",
    lastActive: "2025-09-18",
  },
  {
    id: "fsfsd",
    name: "Jane Smith",
    email: "jane@school.com",
    curricular: "Science",
    status: "Inactive",
    subscription: "free",
    lastActive: "2025-09-15",
  },
  {
    id: "fsfsd",
    name: "Jane Smith",
    email: "jane@school.com",
    curricular: "Science",
    status: "Inactive",
    subscription: "free",
    lastActive: "2025-09-15",
  },
  {
    id: "fsfsd",
    name: "Jane Smith",
    email: "jane@school.com",
    curricular: "Science",
    status: "Inactive",
    subscription: "free",
    lastActive: "2025-09-15",
  },
];

export default function Users() {
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

  const columns = getUserColumns(handleOpenModal);

  return (
    <div className="flex flex-col gap-5.5  ">
      {/* top part */}
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
            <p className="text-[#0C0C0C] text-xl font-medium">{`Teachers (${No_Of_Users})`}</p>
            <p className="text-[#717171] text-base font-normal">
              Manage teacher accounts and permissions
            </p>
          </div>

          <Button
            icon={<UserPlus size={23} />}
            onClick={() => handleOpenModal(AddTeacherModal)}
          >
            Add New Teacher
          </Button>
        </div>

        {/* table */}
        <div className="px-0 p-6">
          <DataTable<User> data={users} columns={columns} />
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
