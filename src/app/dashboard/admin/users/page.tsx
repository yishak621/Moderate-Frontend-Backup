"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import SearchInput from "@/components/ui/SearchInput";

import { userColumns } from "./columns";
import { User } from "./columns";

import { Eye, Pencil, Settings, Trash2, UserPlus } from "lucide-react";

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
];

export default function Users() {
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  const No_Of_Users = 5;

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
      <div className=" py-9 px-11 bg-[#FDFDFD] rounded-[22px]">
        {/* table header */}
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[#0C0C0C] text-xl font-medium">{`Teachers (${No_Of_Users})`}</p>
            <p className="text-[#717171] text-base font-normal">
              Manage teacher accounts and permissions
            </p>
          </div>

          <Button icon={<UserPlus size={23} />}>Add New Teacher</Button>
        </div>

        {/* table */}
        <div className="px-0 p-6">
          <DataTable<User> data={users} columns={userColumns} />
        </div>
      </div>
    </div>
  );
}
