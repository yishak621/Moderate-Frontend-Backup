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
      const container = scrollContainerRef.current;
      const cards = container.children;

      if (cards[index]) {
        const card = cards[index] as HTMLElement;
        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;

        // Center the card in the viewport
        const scrollPosition =
          card.offsetLeft - (containerWidth - cardWidth) / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
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
      const container = scrollContainerRef.current;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;

      // Calculate which card is most centered
      let closestIndex = 0;
      let minDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const viewportCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    }
  };

  return (
    <div className="relative w-full max-w-full">
      {/* Dots Indicator - Repositioned */}
      {stats.length > 1 && (
        <div className="absolute top-[37px] right-5 z-20 flex gap-2   px-3 py-2 ">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-[6px] h-[6px] rounded-full transition-all ${
                index === currentIndex
                  ? "bg-black"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Stats Cards Container - Show only one card at a time */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory w-full"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="flex-shrink-0 snap-center w-full flex justify-center px-4"
            style={{ scrollSnapAlign: "center" }}
          >
            <MobileStatsCard {...stat}>{stat.children}</MobileStatsCard>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileStatsCard({
  title,
  count,
  description,
  colored,
  icon: Icon,
  children,
}: StatsCardProps) {
  return (
    <div
      className=" bg-[#FDFDFD]
        w-full h-[200px]
        rounded-[29px]
        overflow-hidden
      "
    >
      {/* <div
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
      </div> */}

      <div className="flex flex-col justify-between h-full py-3.5 px-[13px]">
        <div>
          <p className="text-[48px] font-medium text-[#0C0C0C]">{count}</p>
          <div className="flex justify-between">
            <p className="text-[12.94px] font-normal text-[#717171]">{title}</p>
            <p className="text-[12.94px] font-normal text-[#BABABA]">
              {description}
            </p>
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
