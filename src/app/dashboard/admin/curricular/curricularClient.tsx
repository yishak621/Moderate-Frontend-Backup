"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getCurricularColumns, getEmailDomainsColumns } from "./columns";
import Modal from "@/components/ui/Modal";
import {
  Eye,
  Loader,
  Pencil,
  Plus,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Curricular } from "@/app/types/curricular";
import AddNewCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/AddNewCurricularAreaModal";
import { EmailDomains } from "@/app/types/emailDomains";
import AddNewEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/AddNewEmailDomainModal";
import { useAdminCurricularAreasData } from "@/hooks/UseAdminRoutes";

const emailDomains: EmailDomains[] = [
  {
    id: "sdfs",
    emailDomain: "etc.com",
    schoolName: "millinium",
    teachers: 4534,
    createdDate: "2025-04-09",
    status: "Active",
  },
  {
    id: "sdfs",
    emailDomain: "etc.com",
    schoolName: "millinium",
    teachers: 4534,
    createdDate: "2025-04-09",
    status: "Active",
  },
  {
    id: "sdfs",
    emailDomain: "etc.com",
    schoolName: "millinium",
    teachers: 4534,
    createdDate: "2025-04-09",
    status: "Active",
  },
];

export default function CurricularClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);

  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const {
    allCurricularAreas,
    isCurricularAreasLoading,
    isCurricularAreasSuccess,
    isCurricularAreasError,
    curricularAreasError,
  } = useAdminCurricularAreasData(page);

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const curricularColumns = getCurricularColumns(handleOpenModal);
  const emailDomainColumns = getEmailDomainsColumns(handleOpenModal);
  console.log("all curricular areas", allCurricularAreas?.data);

  useEffect(() => {
    setTotalPages(allCurricularAreas?.meta.lastPage);
  }, [isCurricularAreasSuccess, allCurricularAreas]);

  return (
    <div className="flex flex-col gap-5.5  ">
      {/* first section */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px]  overflow-scroll max-h-[50vh] scrollbar-hide">
        {/* table header */}
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[#0C0C0C] text-xl font-medium">
              Subject Curricular Area
            </p>
            <p className="text-[#717171] text-base font-normal">
              Organize content by academic subjects and categories
            </p>
          </div>

          <Button
            icon={<Plus size={23} />}
            onClick={() => handleOpenModal(AddNewCurricularAreaModal)}
          >
            Add Subject Curricular Area
          </Button>
        </div>

        {/* table */}
        <div className="px-0 p-6">
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
      {/* second section */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px]  overflow-scroll max-h-[50vh] scrollbar-hide">
        {/* table header */}
        <div className=" flex flex-row justify-between">
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

        {/* table */}
        <div className="px-0 p-6">
          <DataTable<EmailDomains>
            data={emailDomains}
            columns={emailDomainColumns}
          />
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
