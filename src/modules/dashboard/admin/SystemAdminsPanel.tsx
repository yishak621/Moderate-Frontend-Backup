"use client";

import { useState } from "react";
import { ShieldCheck, Mail } from "lucide-react";

import Input from "@/components/ui/Input";
import UserAvatar from "@/components/UserAvatar";
import { useSystemAdmins } from "@/hooks/UseAdminRoutes";
import { timeAgo } from "@/lib/timeAgo";

const PAGE_LIMIT = 8;

export default function SystemAdminsPanel() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { admins, meta, isLoading, isError, error } = useSystemAdmins(
    page,
    PAGE_LIMIT,
    search
  );

  const totalPages = meta?.totalPages ?? 1;
  const canGoNext =
    meta?.hasNextPage ?? (totalPages ? page < totalPages : admins.length === PAGE_LIMIT);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-[#FDFDFD] rounded-[37px] p-6 w-full flex flex-col gap-6 border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-[#0C0C0C]">System Admins</p>
          <p className="text-sm text-[#717171]">
            Manage administrators with elevated privileges
          </p>
        </div>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "Unable to load system admins right now."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: PAGE_LIMIT }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))
          : admins.map((admin: any) => (
              <div
                key={admin.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar
                    size="md"
                    name={admin.name || admin.shortname || "System Admin"}
                    email={admin.email || ""}
                    profilePictureUrl={admin.profilePictureUrl}
                  />
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-[#0C0C0C]">
                      {admin.name || admin.shortname || "System Admin"}
                    </p>
                    <p className="text-sm text-[#717171]">{admin.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {admin.role?.replaceAll("_", " ") || "SYSTEM ADMIN"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#555]">
                  <Mail className="h-4 w-4 text-[#717171]" />
                  <span>{admin.email}</span>
                </div>

                <div className="text-xs text-[#9CA3AF]">
                  {admin.lastLoginAt
                    ? `Last active ${timeAgo(admin.lastLoginAt)}`
                    : admin.createdAt
                    ? `Joined ${timeAgo(admin.createdAt)}`
                    : "Recently added"}
                </div>
              </div>
            ))}
      </div>

      {!isLoading && admins.length === 0 && !isError && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-10 text-center">
          <p className="text-sm font-medium text-[#0C0C0C]">
            No system admins found
          </p>
          <p className="text-sm text-[#717171]">
            Use the actions above to invite or promote a system admin.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#717171]">
          Page {totalPages ? Math.min(page, totalPages) : page} of{" "}
          {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1 || isLoading}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-[#0C0C0C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!canGoNext || isLoading}
            className="rounded-full border border-gray-800 bg-[#0C0C0C] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

