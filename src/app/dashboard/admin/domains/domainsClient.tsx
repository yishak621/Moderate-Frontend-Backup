"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";
import { getEmailDomainsColumns } from "./columns";
import Modal from "@/components/ui/Modal";
import { Loader, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import AddNewEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/AddNewEmailDomainModal";
import { useAdminEmailDomainData } from "@/hooks/UseAdminRoutes";
import { AllowedEmailDomainAttributes } from "@/types/typeLog";

export default function DomainsClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [emailDomainpage, setEmailDomainPage] = useState(1);
  const [totalEmailDomainPages, setTotalEmailDomainPages] = useState(1);

  const { allEmailDomains, isEmailDomainsLoading, isEmailDomainsSuccess } =
    useAdminEmailDomainData(emailDomainpage, searchQuery);

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const emailDomainColumns = getEmailDomainsColumns(handleOpenModal);

  useEffect(() => {
    setTotalEmailDomainPages(allEmailDomains?.meta.lastPage);
  }, [isEmailDomainsSuccess, allEmailDomains]);

  return (
    <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-[#0C0C0C] text-xl font-medium">
            School Email Domains
          </p>
          <p className="text-[#717171] text-base font-normal">
            Manage allowed email domains for teacher registration
          </p>
        </div>

        <Button
          icon={<Plus size={23} />}
          onClick={() => handleOpenModal(AddNewEmailDomainModal)}
        >
          Add Email Domain
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
          placeholder="Search by domain, school, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-[#DBDBDB] rounded-lg focus:outline-none focus:border-[#368FFF] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setEmailDomainPage(1);
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
        {isEmailDomainsLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <DataTable<AllowedEmailDomainAttributes>
            data={allEmailDomains?.data || []}
            columns={emailDomainColumns}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-row gap-2 justify-end">
        <div className="flex gap-2 items-center">
          {/* Back button */}
          <button
            disabled={emailDomainpage === 1}
            onClick={() => setEmailDomainPage((p) => p - 1)}
            className="px-3 py-1 border-0 text-[#717171] disabled:opacity-50 transition-colors duration-300 hover:text-blue-500 cursor-pointer"
          >
            Back
          </button>

          {(() => {
            const pages: (number | string)[] = [];
            const maxVisible = 2;

            // Calculate range
            const startPage = Math.max(1, emailDomainpage - maxVisible);
            const endPage = Math.min(
              totalEmailDomainPages,
              emailDomainpage + maxVisible
            );

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
            if (endPage < totalEmailDomainPages) {
              if (endPage < totalEmailDomainPages - 1) {
                pages.push("...");
              }
              pages.push(totalEmailDomainPages);
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
                  onClick={() => setEmailDomainPage(p as number)}
                  className={`px-3 py-1 border rounded ${
                    p === emailDomainpage
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-100"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          {/* Next button */}
          <button
            disabled={emailDomainpage === totalEmailDomainPages}
            onClick={() => setEmailDomainPage((p) => p + 1)}
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
