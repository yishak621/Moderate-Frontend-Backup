type StatusCardProps = {
  title: string;
  count: number;
  description?: string;
};

export default function StatsCard({
  title,
  count,
  description,
}: StatusCardProps) {
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
        background: "linear-gradient(135deg, #368FFF 0%, #63A8FF 100%)",
      }}
    >
      {/* Background image with reduced opacity */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/statuscardbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 font-medium flex flex-col justify-between h-full py-9 px-12.5 ">
        <p className=" text-[#FDFDFD] text-base ">{title}</p>

        <div className="flex flex-col gap-3">
          <p className="text-[#FDFDFD] text-5xl ">{count}</p>
          <p className="text-[#A7D6FF] text-base ">{description}</p>
        </div>
      </div>
    </div>
  );
}
