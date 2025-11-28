"use client";

import StatsCard from "@/modules/dashboard/StatsCards";
import DataTable from "@/components/table/Table";
import Button from "@/components/ui/Button";

import { getAnnouncementColumns } from "./columns";
import Modal from "@/components/ui/Modal";

import {
  Inbox,
  Plus,
  Send,
  UserPlus,
  RefreshCw,
  CheckCircle,
  Ticket,
  Loader,
  MessageCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Announcement } from "@/app/types/announcement";
import SearchInput from "@/components/ui/SearchInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Support } from "@/app/types/support";
import SupportMessageModal from "@/modules/dashboard/admin/modal/support/SupportMessageModal";
import { StatsCardProps } from "@/types/statusCardProps";
import {
  useAllSupportTickets,
  useSupportStats,
} from "@/hooks/useSupportTickets";
import { useSubjectDomains } from "@/hooks/usePublicRoutes";
import { SubjectDomain } from "@/types/typeLog";

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(
    null
  );
  const [modalProps, setModalProps] = useState<any>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCurricular, setSelectedCurricular] = useState<string>("");

  //HOOKS
  const { stats } = useSupportStats();
  const { tickets, isTicketsLoading, isTicketsFetching } = useAllSupportTickets(
    {
      search: debouncedSearch,
      curricular: selectedCurricular,
      page,
      limit: 10,
    }
  );
  const { subjectDomains, isLoading: isSubjectDomainsLoading } =
    useSubjectDomains();
  const isSearchingTickets = isTicketsFetching && !isTicketsLoading;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCurricular]);

  const statsData: StatsCardProps[] = [
    {
      title: "Total Tickets",
      count: stats?.totalTickets,
      colored: true,
      icon: Ticket,
    },
    { title: "Open", count: stats?.openTickets, icon: Inbox },
    { title: "In Progress", count: stats?.inProgressTickets, icon: RefreshCw },
    { title: "Resolved", count: stats?.resolvedTickets, icon: CheckCircle },
  ];

  const totalTickets = tickets?.meta?.total || 0;
  const totalPages = tickets?.meta?.totalPages || 1;
  const hasNextPage = tickets?.meta?.hasNextPage || false;

  const curricularOptions = useMemo(() => {
    const base =
      subjectDomains?.map((domain: SubjectDomain) => ({
        value: domain.id,
        label: domain.name,
      })) || [];
    return [{ value: "", label: "All Curricular Areas" }, ...base];
  }, [subjectDomains]);

  const handleOpenModal = (
    component: React.FC<unknown>,
    props: unknown = {}
  ) => {
    setModalComponent(() => component);
    setModalProps(props);
    setOpen(true);
  };

  const columns = getAnnouncementColumns(
    handleOpenModal as <P>(component: ComponentType<P>, props?: P) => void
  );

  return (
    <div className="flex flex-col gap-5.5">
      {/* first section */}
      <div className="flex flex-row gap-6  rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7 ">
        {statsData?.map((stat: StatsCardProps) => {
          return (
            <StatsCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              description={stat.description}
              colored={stat.colored}
              icon={stat.icon}
            />
          );
        })}
      </div>

      {/* medium section */}
      <div className="flex flex-row items-end gap-4.5 w-full py-[30px] px-6 rounded-[22px] bg-[#FDFDFD]">
        <div className="basis-3/4 space-y-2">
          <SearchInput
            label="Search by User Email"
            placeholder="teacher@school.com"
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
          {isSearchingTickets && (
            <p
              className="text-sm text-[#717171]"
              role="status"
              aria-live="polite"
            >
              Searching tickets...
            </p>
          )}
        </div>
        <div className="basis-1/4 space-y-2">
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Filter by Curricular Area
          </p>
          <CustomSelect
            options={curricularOptions}
            defaultValue={curricularOptions[0]}
            onChange={(option) =>
              setSelectedCurricular((option?.value as string) || "")
            }
            placeholder={
              isSubjectDomainsLoading
                ? "Loading curricular areas..."
                : "Select curricular area"
            }
            isClearable
          />
        </div>
      </div>
      {/* bottom part */}
      <div className="relative py-9 px-11 bg-[#FDFDFD] rounded-[22px] max-h-screen overflow-y-auto">
        {/* table header */}
        <div className=" flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[#0C0C0C] text-xl font-medium">
              {`Support Tickets(${totalTickets})`}
            </p>
            <p className="text-[#717171] text-base font-normal">
              Manage user support requests and communications
            </p>
          </div>

          <Button
            icon={<Send size={23} />}
            onClick={() => handleOpenModal(SupportMessageModal)}
          >
            Send Messages
          </Button>
        </div>

        {/* table */}
        <div className="px-0 p-6 relative">
          {isTicketsLoading ? (
            <div className="flex flex-col items-center py-14 gap-4">
              <Loader className="animate-spin text-[#0C63E7]" size={34} />
              <p className="text-[#717171] text-sm">Loading tickets...</p>
            </div>
          ) : tickets?.tickets?.length ? (
            <>
              <DataTable<Support> data={tickets.tickets} columns={columns} />
              {isSearchingTickets && <TicketSearchPlaceholder />}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-white">
              <MessageCircle className="text-gray-300 mb-4" size={40} />
              <p className="text-[#0C0C0C] text-lg font-medium">
                No tickets found
              </p>
              <p className="text-[#717171] text-sm max-w-md mt-1">
                Try another email search or pick a different curricular area to
                see more results.
              </p>
            </div>
          )}
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent {...modalProps} />}
            </Modal.Content>
          </Modal>
        </div>

        {/* pagination buttons */}
        {totalPages > 1 && (
          <div className="flex flex-row gap-2 justify-end items-center mt-6 pt-4 border-t border-gray-200">
            {/* Pagination */}
            <div className="flex gap-2 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium text-[#0C0C0C]"
              >
                Previous
              </button>

              <div className="flex gap-1 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-2 min-w-[40px] border rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[#368FFF] text-white border-[#368FFF]"
                          : "bg-white text-[#0C0C0C] border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                disabled={!hasNextPage || page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium text-[#0C0C0C]"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-[#717171] ml-4">
              Page {page} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketSearchPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[18px] bg-white/80 backdrop-blur-sm">
      <Loader className="animate-spin text-[#0C63E7]" size={28} />
      <p className="text-[#0C0C0C] font-medium">Updating ticket list…</p>
      <p className="text-[#717171] text-sm">
        Fetching the latest support tickets for your filters.
      </p>
    </div>
  );
}
