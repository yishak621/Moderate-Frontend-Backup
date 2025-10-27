import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 w-full px-4 ">
      <div className="flex flex-col items-center sm:mb-[50px] 2xl:mb-[100px]">
        <div className="flex flex-row items-center bg-[#f3f3f3] rounded-[41.5px] gap-2.5 py-3.5 px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#2997F1" />
          </svg>
          <p className="text-[#000] text-base font-medium">Moderate</p>
        </div>
        <h1 className="mt-4 text-[96px] text-[#000] font-medium text-center max-w-[741px] font-['SF Pro Display'] leading-tight">
          Upload once, discuss together
        </h1>
        <span className=" text-center text-[#666] font-medium text-base">
          Helping educators collaborate on grading without exposing student
          data.
        </span>
      </div>

      <div className=" sm:mt-[25px] 2xl:mt-[62px] flex justify-center">
        <Link
          href="/auth/register"
          className="
               text-center
              bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4
              rounded-full text-base font-medium transition-all duration-300 
              hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 
              transform hover:-translate-y-1 active:scale-95
            "
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
