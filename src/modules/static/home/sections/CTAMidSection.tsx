import Link from "next/link";
import Image from "next/image";

export default function CTAMidSection() {
  return (
    <section className="w-full py-[87px] px-[124px] border border-[#C6C6C6] rounded-[65px] relative overflow-hidden max-w-[1402px] mx-auto">
      <div className="flex flex-row items-center justify-between relative z-10">
        {/* Left Content */}
        <div className="flex flex-col items-start">
          <h3 className="mt-6 text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
            Upload once, discuss together
          </h3>
          <p className="text-[#666] text-base font-medium leading-normal mb-[36px] max-w-[450px]">
            Docs or scans—names excluded by design. Grade with your own rubric
            and comment in one place.
          </p>

          <Link
            href="/auth/register"
            className="
                 text-center inline-block
                bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4
                rounded-full text-base font-medium transition-all duration-300
                hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40
                transform hover:-translate-y-1 active:scale-100
                border-2 border-transparent hover:border-white/20
              "
          >
            Create your first moderate post
          </Link>
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden rounded-[65px] h-full">
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
