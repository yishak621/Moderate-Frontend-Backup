export default function PostTags({
  type,
  text,
}: {
  type?: string;
  text: string;
}) {
  return (
    <div
      className={`py-1 px-2 sm:px-3 flex flex-row items-center justify-center rounded-[47px] text-xs sm:text-sm whitespace-nowrap ${
        type === "colored"
          ? "bg-[#368FFF] text-white"
          : "border border-[#DBDBDB] text-[#717171]"
      }`}
    >
      {text}
    </div>
  );
}
