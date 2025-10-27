import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full px-2">
      <div className="flex flex-col items-center mb-12 sm:mb-16 md:mb-[50px] 2xl:mb-[100px]">
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
            Moderate
          </p>
        </div>
        <h1 className="mt-8 sm:mt-10 md:mt-12 lg:mt-8 text-[48px] sm:text-[52px] md:text-[64px] lg:text-[80px] xl:text-[96px] text-[#000] font-medium text-center max-w-full sm:max-w-[600px] lg:max-w-[741px] font-['SF Pro Display'] leading-tight px-4">
          Upload once, discuss together
        </h1>
        <span className="text-center text-[#666] font-medium text-sm sm:text-base max-w-full sm:max-w-[600px] px-4 mt-4 sm:mt-6">
          Helping educators collaborate on grading without exposing student
          data.
        </span>
      </div>

      <div className="mt-12 sm:mt-[25px] 2xl:mt-[62px] flex justify-center">
        <Link
          href="/auth/register"
          className="
               text-center
              bg-[#2997F1] hover:bg-[#2178c9] text-white px-6 py-3 sm:px-8 sm:py-4
              rounded-full text-sm sm:text-base font-medium transition-all duration-300 
              hover:scale-110 hover:shadow-2xl hover:shadow-[#2997F1]/50 
              transform hover:-translate-y-1 active:scale-95
            "
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
