import { StatsCardProps } from "@/types/statusCardProps";

export default function StatsCard({
  title,
  count,
  description,
  colored,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div
      className="
    flex flex-col justify-between my-card
    w-full max-w-[300px] md:max-w-[450px] 
    aspect-[116/225] 
    rounded-3xl 
    overflow-hidden 
    relative
    mask-image: radial-gradient(circle at top left, transparent 225px, black 226px);
    mask-repeat: no-repeat; mask-size: 100% 100%
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
        } z-10 font-medium flex flex-col justify-between h-full py-9 px-12.5`}
      >
        <p className="  text-base ">{title}</p>

        <div className="flex flex-col gap-3">
          <p className=" text-5xl ">{count}</p>
          <p
            className={`${
              colored ? "text-[#A7D6FF]" : "text-[#5BA941]"
            }  text-base`}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="absolute  rounded-3xl   top-2 right-0 w-[93px] h-[79px] flex items-center justify-center">
        {Icon && <Icon className="w-6 h-6 text-[#717171]" />}
      </div>
    </div>
  );
}
