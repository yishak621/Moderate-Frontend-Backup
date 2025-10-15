import { GroupedGrade } from "@/app/types/user";
import { timeAgo } from "@/lib/timeAgo";

// type GroupedGrade = {
//   gradedBy: string;
//   grade: any;
//   comment: string | null;
//   createdAt: string;
// };

type GradeGivenSectionProps = {
  grade: GroupedGrade;
  gradingTemplate: any;
  children?: React.ReactNode; // 👈 allow dynamic section
};

export default function GradeGivenSection({
  grade,
  gradingTemplate,

  children,
}: GradeGivenSectionProps) {
  console.log(grade);
  if (!grade) return null;

  return (
    <div className="rounded-3xl border border-[#DBDBDB] py-6 px-7.5 my-5 flex flex-col gap-6">
      <div className="flex items-center gap-2.5 ">
        <div className="w-[38px] h-[38px] rounded-full bg-amber-300" />
        <div>
          <p className="text-[#0C0C0C] text-base font-normal">
            {grade.gradedBy.name}
          </p>
          <p className="text-[14px] font-normal text-[#717171]">
            {timeAgo(grade.createdAt)}
          </p>
        </div>
      </div>
      <div className=" border-l-4 border-[#368FFF] pl-3.5">
        <p className="text-sm text-[#717171] italic"> {grade.comment}</p>{" "}
        <div className="mt-2">{children}</div>
      </div>{" "}
    </div>
  );
}
