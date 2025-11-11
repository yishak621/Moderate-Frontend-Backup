"use client";

import DataTable from "@/components/table/Table";
import Modal from "@/components/ui/Modal";
import { Loader } from "lucide-react";
import { useState } from "react";
import { getAppealsColumns } from "./columns";
import { useAllAppeals } from "@/hooks/useModeration";
import { Appeal } from "@/types/moderation";
import CustomSelect from "@/components/ui/CustomSelect";

const filterOptions = [
  { value: "all", label: "All Appeals" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function AppealsClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState("all");

  const { data: allAppeals, isLoading } = useAllAppeals();

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const columns = getAppealsColumns(handleOpenModal);

  const appealsList = allAppeals || [];
  const filteredAppeals =
    filter === "all"
      ? appealsList
      : appealsList.filter((appeal) => appeal.status === filter);

  return (
    <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[#0C0C0C] text-xl font-medium">
            {`Appeals (${filteredAppeals.length})`}
          </p>
          <p className="text-[#717171] text-base font-normal">
            Review and process user appeals
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
          <DataTable<Appeal> data={filteredAppeals} columns={columns} />
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

