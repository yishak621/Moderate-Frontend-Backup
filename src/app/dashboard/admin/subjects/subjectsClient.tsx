"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";
import { getCurricularColumns } from "./columns";
import Modal from "@/components/ui/Modal";
import { Loader, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Curricular } from "@/app/types/curricular";
import AddNewCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/AddNewCurricularAreaModal";
import { useAdminCurricularAreasData } from "@/hooks/UseAdminRoutes";

export default function SubjectsClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    allCurricularAreas,
    isCurricularAreasLoading,
    isCurricularAreasSuccess,
  } = useAdminCurricularAreasData(page, searchQuery);

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const curricularColumns = getCurricularColumns(handleOpenModal);

  useEffect(() => {
    setTotalPages(allCurricularAreas?.meta.lastPage);
  }, [isCurricularAreasSuccess, allCurricularAreas]);

  return (
    <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-[#0C0C0C] text-xl font-medium">
            Subject Curricular Areas
          </p>
          <p className="text-[#717171] text-base font-normal">
            Organize content by academic subjects and categories
          </p>
        </div>

        <Button
          icon={<Plus size={23} />}
          onClick={() => handleOpenModal(AddNewCurricularAreaModal)}
        >
          Add Subject Area
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#717171]"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by subject name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-[#DBDBDB] rounded-lg focus:outline-none focus:border-[#368FFF] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-200 bg-gray-100 rounded-full transition-colors flex items-center justify-center"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[60vh] scrollbar-hide">
        {isCurricularAreasLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <DataTable<Curricular>
            data={allCurricularAreas?.data || []}
            columns={curricularColumns}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-row gap-2 justify-end">
        <div className="flex gap-2 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border-0 text-[#717171] disabled:opacity-50 transition-colors duration-300 hover:text-blue-500 cursor-pointer"
          >
            Back
          </button>

          {(() => {
            const pages: (number | string)[] = [];
            const maxVisible = 2;

            // Calculate range
            const startPage = Math.max(1, page - maxVisible);
            const endPage = Math.min(totalPages, page + maxVisible);

            // Add first page and ellipsis if needed
            if (startPage > 1) {
              pages.push(1);
              if (startPage > 2) {
                pages.push("...");
              }
            }

            // Add page numbers in range
            for (let p = startPage; p <= endPage; p++) {
              pages.push(p);
            }

            // Add ellipsis and last page if needed
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push("...");
              }
              pages.push(totalPages);
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-3 py-1 text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => setPage(p as number)}
                  className={`px-3 py-1 border rounded ${
                    p === page
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-100"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border-0 text-[#717171] disabled:opacity-50 transition-colors duration-300 hover:text-blue-500 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Content>
          {ModalComponent && <ModalComponent {...modalProps} />}
        </Modal.Content>
      </Modal>
    </div>
  );
}
