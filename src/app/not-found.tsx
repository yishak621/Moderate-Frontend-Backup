"use client";

import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[#368FFF] via-[#63a8ff] to-indigo-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#368FFF] to-indigo-600 flex items-center justify-center shadow-2xl">
            <FileQuestion className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-md mx-auto"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          <br />
          Let&apos;s get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#368FFF] hover:bg-[#2574db] text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Quick Links Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-5 h-5 text-[#368FFF]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Pages
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/teacher"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#368FFF] font-medium rounded-lg transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/teacher/grading"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#368FFF] font-medium rounded-lg transition-colors text-sm"
            >
              Grading
            </Link>
            <Link
              href="/dashboard/teacher/posts"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#368FFF] font-medium rounded-lg transition-colors text-sm"
            >
              My Posts
            </Link>
            <Link
              href="/dashboard/teacher/messages"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#368FFF] font-medium rounded-lg transition-colors text-sm"
            >
              Messages
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#368FFF] font-medium rounded-lg transition-colors text-sm"
            >
              Pricing
            </Link>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-gray-500"
        >
          If you believe this is an error, please contact support
        </motion.p>
      </motion.div>
    </div>
  );
}

