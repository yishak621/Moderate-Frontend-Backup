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
    flex flex-col justify-between
    w-[350px] lg:w-[400px]
    h-[225px]
    rounded-3xl 
    overflow-hidden 
    relative
    shadow-lg
  "
      style={{
        background:
          colored === true
            ? "linear-gradient(135deg, #368FFF 0%, #63A8FF 100%)"
            : "#F1F1F1",
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
        } z-10 font-medium flex flex-col justify-between h-full py-9 px-12`}
      >
        <p className="text-base font-semibold">{title}</p>

        <div className="flex flex-col gap-3">
          <p className="text-5xl font-bold">{count}</p>
          <p
            className={`${
              colored ? "text-[#A7D6FF]" : "text-[#5BA941]"
            } text-base font-normal`}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="absolute rounded-3xl top-2 right-2 w-[93px] h-[79px] flex items-center justify-center">
        {Icon && <Icon className="w-6 h-6 text-[#717171]" />}
      </div>
    </div>
  );
}
