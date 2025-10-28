"use client";
import { StatsCardProps } from "@/types/statusCardProps";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

interface MobileStatsCardsProps {
  stats: StatsCardProps[];
}

export default function MobileStatsCards({ stats }: MobileStatsCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Mobile card width (smaller for better fit)
      const gap = 16; // Gap between cards
      const scrollPosition = index * (cardWidth + gap);

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  const nextCard = () => {
    const nextIndex = (currentIndex + 1) % stats.length;
    scrollToIndex(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = currentIndex === 0 ? stats.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 280; // Use fixed card width for consistency
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* Stats Cards Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {stats.map((stat, index) => (
          <div key={stat.title} className="flex-shrink-0 snap-start">
            <MobileStatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {stats.length > 1 && (
        <>
          <button
            onClick={prevCard}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            aria-label="Previous card"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <button
            onClick={nextCard}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            aria-label="Next card"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {stats.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileStatsCard({
  title,
  count,
  description,
  colored,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div
      className="
        flex flex-col justify-between
        w-[280px] sm:w-[320px] h-[180px] sm:h-[200px]
        rounded-[20px] sm:rounded-[29px]
        overflow-hidden 
        relative
        shadow-lg
        flex-shrink-0
      "
      style={{
        background:
          colored === true
            ? "linear-gradient(135deg, #368FFF 0%, #63A8FF 100%)"
            : "",
      }}
    >
      {/* Background image with reduced opacity */}
      <div
        className="absolute inset-0 opacity-20"
        style={
          colored === true
            ? {
                backgroundImage: "url('/images/statuscardbg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundColor: "#F1F1F1" }
        }
      />

      <div
        className={`relative ${
          colored ? "text-[#FDFDFD]" : "text-[#0c0c0c]"
        } z-10 font-medium flex flex-col justify-between h-full py-4 px-6`}
      >
        <p className="text-sm font-semibold">{title}</p>

        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">{count}</p>
          <p
            className={`${
              colored ? "text-[#A7D6FF]" : "text-[#5BA941]"
            } text-xs font-normal`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="absolute rounded-[29px] top-2 right-2 w-[50px] h-[40px] flex items-center justify-center">
        {Icon && <Icon className="w-4 h-4 text-[#717171]" />}
      </div>
    </div>
  );
}
