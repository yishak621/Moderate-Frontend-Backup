"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Upload once, discuss together",
    description:
      "Docs or scans; multi‑page; names and identifiers are excluded by design.",
    image: "/images/services/aa.png",
    icon: "📁",
  },
  {
    id: 2,
    title: "Moderation across schools",
    description:
      "Filter by school or district; follow teachers and schools you trust.",
    image: "/images/services/bb.png",
    icon: "👥",
  },
  {
    id: 3,
    title: "Grade anything",
    description: "Letters, numbers, symbols—your rubric, your way.",
    image: "/images/services/cc.png",
    icon: "⚖️",
  },
  {
    id: 4,
    title: "Privacy & compliance",
    description:
      "Domain‑restricted sign‑ups, periodic email checks, and auditable histories.",
    image: "/images/services/dd.png",
    icon: "📊",
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section className="py-12 sm:py-16 md:py-20 w-full px-2">
      {/* Top section */}
      <div className="w-full flex flex-col mb-8 sm:mb-12">
        <div className="flex flex-col items-start mb-6 sm:mb-6 2xl:mb-16">
          <div className="flex flex-row items-center bg-[#f3f3f3] rounded-[41.5px] gap-2.5 py-2.5 px-4 sm:py-3.5 sm:px-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <circle cx="5" cy="5" r="5" fill="#2997F1" />
            </svg>
            <p className="text-[#000] text-sm sm:text-base font-medium">
              Services
            </p>
          </div>
        </div>

        <h3 className="mt-0 text-[20px] sm:text-[28px] md:text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
          Simplifying your work with our service
        </h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`
        relative p-6 rounded-xl cursor-pointer transition-all duration-300
        flex items-start gap-4 justify-between
        ${
          activeService === index
            ? "text-[#000] shadow-sm"
            : "text-[#838383] hover:text-[#000]"
        }
      `}
              onClick={() => setActiveService(index)}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 120,
              }}
            >
              {/* ✅ Active RIGHT Indicator Icon */}
              {activeService === index && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="80"
                    viewBox="0 0 34 80"
                    fill="none"
                  >
                    <rect
                      x="13.5"
                      y="7.5"
                      width="8"
                      height="68"
                      rx="4"
                      fill="#255CE4"
                    />
                    <g
                      style={{ mixBlendMode: "plus-lighter" }}
                      filter="url(#filter0_f_2192_558)"
                    >
                      <path
                        d="M13.0695 13.2971L21.0043 12.5V13.6957L21.5 67.5H12.5L13.0695 13.2971Z"
                        fill="#5488F9"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_2192_558"
                        x="0"
                        y="0"
                        width="34"
                        height="80"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feGaussianBlur
                          stdDeviation="6.25"
                          result="effect1_foregroundBlur_2192_558"
                        />
                      </filter>
                    </defs>
                  </svg>
                </motion.div>
              )}{" "}
              {/* Icon + Title + Text */}
              <div className="flex-1">
                <h4
                  className={`
            text-base sm:text-lg md:text-xl font-medium mb-2.5 transition-colors
            ${activeService === index ? "text-[#000]" : "text-[#4b4b4b]"}
          `}
                >
                  {service.title}
                </h4>
                <p
                  className={`
            text-sm sm:text-base md:text-lg font-medium leading-relaxed transition-opacity
            ${activeService === index ? "text-[#707070]" : "text-[#838383]"}
          `}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side - Display Box */}
        <div className="relative w-full max-w-full lg:max-w-[590px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[495px] rounded-[24px] sm:rounded-[30px] lg:rounded-[37px] bg-[rgba(50,50,50,0.04)] backdrop-blur-[6.5px] overflow-hidden flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 30, scale: 1.05 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#F7F7F7] to-indigo-200 flex flex-col items-center justify-center px-6 text-center">
                <Image
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  width={1000}
                  height={1000}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Decor Blur Elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-400/30 rounded-full blur-md"></div>
        </div>
      </div>
    </section>
  );
}
