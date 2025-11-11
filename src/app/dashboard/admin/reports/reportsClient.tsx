"use client";

import DataTable from "@/components/table/Table";
import Modal from "@/components/ui/Modal";
import { Loader } from "lucide-react";
import { useState } from "react";
import { getReportsColumns } from "./columns";
import { useAllReports } from "@/hooks/useModeration";
import { Report } from "@/types/moderation";
import ViewReportModal from "@/modules/dashboard/admin/modal/reports/ViewReportModal";
import ResolveReportModal from "@/modules/dashboard/admin/modal/reports/ResolveReportModal";

export default function ReportsClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  const { data: reports, isLoading, isError } = useAllReports();

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const columns = getReportsColumns(handleOpenModal);

  const reportsList = reports || [];

  return (
    <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[#0C0C0C] text-xl font-medium">
            {`Reports (${reportsList.length})`}
          </p>
          <p className="text-[#717171] text-base font-normal">
            Manage and resolve user reports
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="px-0 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Failed to load reports</p>
          </div>
        ) : (
          <DataTable<Report> data={reportsList} columns={columns} />
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

