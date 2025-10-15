"use client";
import React from "react";

/**
 * Usage:
 * {activeFilter === "Grade Test" && checkPostIsGradedByThisUser && (
 *   <AlreadyGradedNotice onEdit={() => openEditModal()} />
 * )}
 */

type AlreadyGradedNoticeProps = {
  onEdit: () => void;
};

export default function AlreadyGradedNotice({
  onEdit,
}: AlreadyGradedNoticeProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="max-w-xl mx-auto my-4 p-4 sm:p-6 rounded-2xl shadow-md  bg-white  border border-slate-100  flex items-start gap-4 sm:gap-6 transition-transform transform hover:-translate-y-0.5"
    >
      {/* SVG icon */}
      <div className="flex-none">
        <svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-2 bg-amber-50  border border-amber-100 "
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="8"
            width="48"
            height="48"
            rx="10"
            fill="url(#g)"
            opacity="0.12"
          />
          <path
            d="M32 16c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16z"
            fill="#FFFBEB"
          />
          <path
            d="M26 33l4.5 4.5L38 30"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 10v6"
            stroke="#F97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Text & actions */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 ">
          You already graded this
        </h3>

        <p className="mt-1 text-xs sm:text-sm text-slate-500  leading-snug">
          Our records show youve already submitted a grade for this post. You
          can review or update your grade if needed.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-slate-800 active:translate-y-0.5 transition"
            aria-label="Edit your grade"
          >
            {/* pencil icon */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l9.414-9.414a1 1 0 00-1.414-1.414L8 18.293A1 1 0 007.707 19H4v1z"
              />
            </svg>
            <span>Update grade</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText("I already graded this post")
            }
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-transparent border border-slate-200  text-slate-600  text-xs sm:text-sm hover:bg-slate-50  transition"
            aria-label="Copy note"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3h8v4M8 21H6a2 2 0 01-2-2V7h2v12h2zM16 21h-8v-2h8v2zM18 7v12a2 2 0 002 2h-2V7h2z"
              />
            </svg>
            <span>Copy note</span>
          </button>
        </div>
      </div>

      {/* subtle dismiss (optional) */}
      <div className="flex-none self-start">
        <button
          type="button"
          className="p-2 rounded-md text-slate-400 hover:text-slate-600  transition"
          aria-label="Dismiss"
          onClick={(e) => {
            // small inline handler in case parent wants closure — prefer lifting state up in real app
            e.currentTarget
              .closest("section")
              ?.classList.add("opacity-0", "pointer-events-none");
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
