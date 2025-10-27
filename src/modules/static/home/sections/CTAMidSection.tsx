import Link from "next/link";
import Image from "next/image";

export default function CTAMidSection() {
  return (
    <section className="w-full py-12 px-6 sm:py-16 sm:px-10 md:py-20 md:px-16 lg:py-[48px] lg:px-24 xl:py-[64px] xl:px-[100px] 2xl:py-[87px] 2xl:px-[124px] border border-[#C6C6C6] rounded-[20px] sm:rounded-[35px] md:rounded-[50px] lg:rounded-[65px] relative overflow-hidden max-w-full lg:max-w-[1402px] mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between relative z-10 gap-10 lg:gap-0">
        {/* Content */}
        <div className="flex flex-col items-start w-full lg:w-auto gap-6">
          <h3 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
            Upload once, discuss together
          </h3>
          <p className="text-[#666] text-sm sm:text-base font-medium leading-normal max-w-full lg:max-w-[450px]">
            Docs or scans—names excluded by design. Grade with your own rubric
            and comment in one place.
          </p>

          <Link
            href="/auth/register"
            className="
                 text-center inline-block
                bg-[#2997F1] hover:bg-[#2178c9] text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4
                rounded-full text-sm sm:text-base font-medium transition-all duration-300
                hover:scale-105 hover:shadow-xl hover:shadow-[#2997F1]/40
                transform hover:-translate-y-1 active:scale-100
                border-2 border-transparent hover:border-white/20
              "
          >
            Create your first moderate post
          </Link>
        </div>
      </div>
      {/* Background Image - Only visible on larger screens */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden rounded-[65px] h-full">
        <Image
          src="/images/hero-section.png"
          alt="Hero Image"
          fill
          style={{ objectFit: "contain" }}
          className="transform translate-x-[40%] translate-y-[10%]"
        />
      </div>
    </section>
  );
}
