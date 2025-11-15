interface MotoSectionProps {
  align?: "left" | "center" | "right";
}

export default function MotoSection({ align = "left" }: MotoSectionProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 mt-8 sm:mt-[50px] md:mt-[75px] lg:mt-[100px] 2xl:mt-[177px] w-full px-2">
      <div
        className={`w-full flex flex-col gap-3 sm:gap-4 ${alignClasses[align]}`}
      >
        <p className="text-[#6E6E6E] text-sm sm:text-base font-light px-4 sm:px-0">
          Helping Teachers collaborate on grading without exposing student data.
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[96px] text-[#000] font-medium leading-tight sm:leading-tight md:leading-tight lg:leading-normal xl:leading-normal 2xl:leading-normal px-4 sm:px-0">
          <span className="text-[#5C5C5C]">Upload. Share. </span>Moderate across
          schools—secure & transparent.
        </h2>
      </div>
    </section>
  );
}
