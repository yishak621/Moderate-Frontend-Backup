"use client";

import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getCurricularColumns, getEmailDomainsColumns } from "./columns";
import Modal from "@/components/ui/Modal";
import { Eye, Pencil, Plus, Settings, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Curricular } from "@/app/types/curricular";
import AddNewCurricularAreaModal from "@/modules/dashboard/admin/modal/curricular/AddNewCurricularAreaModal";
import { EmailDomains, emailDomains } from "@/app/types/emailDomains";
import AddNewEmailDomainModal from "@/modules/dashboard/admin/modal/emailDomain/AddNewEmailDomainModal";

const curriculars: Curricular[] = [
  {
    id: "sdfs",
    name: "Mathematics",
    teachers: 4534,
    posts: 4234,
    description: "thish sdjha",
    status: "Active",
  },
  {
    id: "sdfs",
    name: "Mathematics",
    teachers: 4534,
    posts: 4234,
    description: "thish sdjha",
    status: "Inactive",
  },
  {
    id: "sdfs",
    name: "Mathematics",
    teachers: 4534,
    posts: 4234,
    description: "thish sdjha",
    status: "Active",
  },
];

const emailDomains: emailDomains[] = [
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

  const handleOpenModal = (
    component: React.FC<unknown>,
    props: unknown = {}
  ) => {
    setModalComponent(() => component);
    setModalProps(props);
    setOpen(true);
  };

  const curricularColumns = getCurricularColumns(handleOpenModal);
  const emailDomainColumns = getEmailDomainsColumns(handleOpenModal);

  return (
    <div className="flex flex-col gap-5.5  ">
      {/* first section */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px]  overflow-scroll">
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
          <DataTable<Curricular>
            data={curriculars}
            columns={curricularColumns}
          />
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
      {/* second section */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px]  overflow-scroll">
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
