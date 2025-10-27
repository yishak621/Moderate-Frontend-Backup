import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="sm:mt-[100px] 2xl:mt-[150px] w-full ">
      {/* Top section */}
      <div className="w-full px-4 flex flex-col gap-3">
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
          <p className=" text-[#838383] text-base font-medium">
            Collaborative grading platform
          </p>
        </div>

        <div>
          <h1 className="text-[#0C0C0C] text-[58px] leading-[70px] max-w-[828px] font-medium">
            Grade moderation made easy with our collaborative grading platform.
          </h1>
        </div>
      </div>
      {/* Bottom section */}
      <div className="w-full px-4 flex flex-col gap-3 mt-[68px]">
        <Image
          src="/images/hero-section.png"
          alt="Hero Image"
          width={1000}
          height={1000}
        />
      </div>
    </section>
  );
}
