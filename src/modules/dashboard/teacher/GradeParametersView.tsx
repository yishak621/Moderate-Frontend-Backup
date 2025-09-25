export default function GradeParametersView({
  name,
  result,
}: {
  name: string;
  result: string;
}) {
  return (
    <div className=" flex flex-row gap-2.5 items-center rounded-[10px] justify-center border border-[#BABABA] w-full py-3 bg-[#fdfdfd]">
      <p className="text-[#0c0c0c]"> {name}:</p>
      <p className="text-[#bababa]">{result}</p>
    </div>
  );
}
