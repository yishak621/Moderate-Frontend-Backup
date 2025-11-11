"use client";

import DataTable from "@/components/table/Table";
import Modal from "@/components/ui/Modal";
import { Loader } from "lucide-react";
import { useState } from "react";
import { getModeratedUsersColumns } from "./columns";
import { useModeratedUsers, usePendingReviewUsers } from "@/hooks/useModeration";
import { UserModeration } from "@/types/moderation";
import CustomSelect from "@/components/ui/CustomSelect";

const filterOptions = [
  { value: "all", label: "All Moderated Users" },
  { value: "pending", label: "Pending Review" },
];

export default function ModeratedUsersClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState("all");

  const { data: allModeratedUsers, isLoading: isLoadingAll } = useModeratedUsers();
  const { data: pendingUsers, isLoading: isLoadingPending } = usePendingReviewUsers();

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const columns = getModeratedUsersColumns(handleOpenModal);

  const isLoading = filter === "all" ? isLoadingAll : isLoadingPending;
  const usersList =
    filter === "all"
      ? allModeratedUsers || []
      : pendingUsers || [];

  return (
    <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[#0C0C0C] text-xl font-medium">
            {`Moderated Users (${usersList.length})`}
          </p>
          <p className="text-[#717171] text-base font-normal">
            Manage suspended, banned, and pending review users
          </p>
        </div>
        <div className="w-48">
          <CustomSelect
            options={filterOptions}
            defaultValue={filterOptions.find((f) => f.value === filter)}
            onChange={(option) => setFilter(option?.value as string || "all")}
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-0 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <DataTable<UserModeration> data={usersList} columns={columns} />
        )}

        <Modal isOpen={open} onOpenChange={setOpen}>
          <Modal.Content>
            {ModalComponent && <ModalComponent {...modalProps} />}
          </Modal.Content>
        </Modal>
      </div>
    </div>
  );
}

