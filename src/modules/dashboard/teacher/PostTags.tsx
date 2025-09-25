export default function PostTags({ type, text }: { type?: string; text: string }) {
  return (
    <div
      className={`py-1 px-3 flex flex-row items-center justify-center rounded-[47px] text-sm ${
        type === "colored"
          ? "bg-[#368FFF] text-white"
          : "border border-[#DBDBDB] text-[#717171]"
      }`}
    >
      {text}
    </div>
  );
}
