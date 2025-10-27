import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full pt-16 sm:pt-24 md:pt-32 lg:pt-40 xl:pt-[120px] 2xl:pt-[150px]">
      {/* Top section */}
      <div className="w-full px-2 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#2997F1" />
          </svg>
          <p className="text-[#838383] text-[14px] font-medium">
            Collaborative grading platform
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex-1">
            <h1 className="text-[#0C0C0C] text-[24px] leading-[28px] sm:text-[28px] sm:leading-[34px] md:text-[36px] md:leading-[42px] lg:text-[48px] lg:leading-[56px] xl:text-[58px] xl:leading-[70px] max-w-[828px] font-medium">
              Grade moderation made easy with our collaborative grading
              platform.
            </h1>
          </div>
        </div>
      </div>
      {/* Bottom section */}
      <div className="w-full px-2 flex flex-col gap-3 mt-8 sm:mt-12 md:mt-16 lg:mt-[48px] xl:mt-[68px]">
        <Image
          src="/images/hero-section.png"
          alt="Hero Image"
          width={1000}
          height={1000}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
