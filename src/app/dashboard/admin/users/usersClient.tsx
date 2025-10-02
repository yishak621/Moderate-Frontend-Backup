"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";
import SearchInput from "@/components/ui/SearchInput";

import { getUserColumns } from "./columns";
import Modal from "@/components/ui/Modal";

import { Eye, Loader, Pencil, Settings, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
import { User } from "@/app/types/user";
import { useAdminUsersData } from "@/hooks/UseAdminRoutes";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";
import { Controller, useForm } from "react-hook-form";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function UsersClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);

  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //HOOKS
  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();
  //HOOKS
  const {
    subjectDomains,
    isLoading: issubjectDomainsLoading,
    isSuccess: issubjectDomainsSuccess,
    isError: issubjectDomainsError,
    error: subjectDomainError,
  } = useSubjectDomains();

  const optionsSubjectDomains = subjectDomains?.map((item: SubjectDomain) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const { allUsers, isUsersLoading, isSuccess, isError, error } =
    useAdminUsersData(page);

  console.log("all users", allUsers);

  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  const No_Of_Users = allUsers?.meta?.total;

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const columns = getUserColumns(handleOpenModal);

  useEffect(() => {
    setTotalPages(allUsers?.meta.lastPage);
  }, [isSuccess]);

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
          {/* <div>
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Filter by Curricular Area
            </p>{" "}
            <CustomMultiSelect
              placeholder="All Curricular Area"
              options={optionsSubjectDomains}
              onChange={handleSelected}
            />
          </div> */}
          <div>
            <p className="text-[#0c0c0c] text-base font-normal mb-1">
              Filter by Curricular Area
            </p>
            <Controller
              name="subjectDomains"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={optionsSubjectDomains}
                  onChange={field.onChange}
                  placeholder="Select Curricular..."
                />
              )}
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
          {/* {allUsers ? (
            <DataTable<User> data={users} columns={columns} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          )} */}

          {isUsersLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : (
            <DataTable<User> data={allUsers?.users || []} columns={columns} />
          )}
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </Modal.Content>
          </Modal>
        </div>

        {/* pagination buttons */}
        <div className=" flex flex-row gap-2 justify-self-end">
          {/* Pagination */}
          <div className="flex gap-2 mt-4">
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
