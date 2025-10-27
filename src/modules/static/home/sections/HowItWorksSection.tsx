import Link from "next/link";

const items = [
  {
    number: 1,
    title: "Register",
    description: "Register with your school email and subjects",
    colored: true,
  },

  {
    number: 2,
    title: "Upload & Moderate",
    description:
      "Blur names, add grades & comments, start private chats (if both parties allow).",
    colored: false,
  },

  {
    number: 3,
    title: "Track & Learn",
    description: "Use your school email and select your subjects.",
    colored: false,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full px-2">
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
        {/* Left Section */}
        <div className="flex flex-col items-start">
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
            <p className="text-[#000] text-base font-medium">How</p>
          </div>

          <h3 className="mt-4 sm:mt-6 text-[20px] sm:text-[28px] md:text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
            How It Works
          </h3>
          <p className="text-[#666] text-sm sm:text-base font-medium leading-normal mb-6 sm:mb-8 md:mb-[36px] max-w-[450px]">
            Register with your school email and subjects, upload anonymized work
            to grade and comment (with optional private chats), and track
            audits, history, favorites, and insights across schools and
            districts.
          </p>

          <Link
            href="/auth/register"
            className="
               text-center inline-block
              bg-[#2997F1] hover:bg-[#2178c9] text-white px-8 py-4
              rounded-full text-base font-medium transition-all duration-300
              hover:scale-110 hover:shadow-2xl hover:shadow-[#2997F1]/50
              transform hover:-translate-y-2 hover:rotate-1 active:scale-95
              relative overflow-hidden group
            "
          >
            <span className="relative z-10">Start Now</span>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-6 sm:gap-8 2xl:gap-[70px]">
          {items.map((item) => (
            <Item key={item.number} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({
  number,
  title,
  description,
  colored,
}: {
  number: number;
  title: string;
  description: string;
  colored: boolean;
}) {
  return (
    <div
      className={`${
        colored ? "bg-[#000000]" : "bg-[#f7f7f7]"
      } flex flex-col sm:flex-row w-full py-[36.204px] px-[35.169px] sm:py-[70px] sm:px-[68px] items-start gap-[5.172px] sm:gap-[40px] sm:items-center rounded-[32px]`}
    >
      <div
        className={`${
          colored ? "text-[#E7E7E7]" : "text-[#000]"
        } text-[32px] sm:text-[48px] md:text-[64px] font-bold`}
      >
        {number}
      </div>
      <div className="flex flex-col items-start font-medium leading-normal gap-2 max-w-full sm:max-w-[453px]">
        <p
          className={`text-sm sm:text-lg md:text-[20px] font-sf-pro-display ${
            colored ? "text-[#E7E7E7]" : "text-[#000]"
          }`}
        >
          {title}
        </p>
        <p className="text-[#838383] text-xs sm:text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
