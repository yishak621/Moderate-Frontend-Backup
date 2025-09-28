import GradeParametersView from "./GradeParametersView";

// components/GradeGivenSection.tsx
type GroupedGrade = {
  gradedBy: string;
  grade: string;
  comment: string | null;
  createdAt: string;
};

type GradeGivenSectionProps = {
  grader: GroupedGrade;
  date: string;
  authorName: string;
};

export default function GradeGivenSection({
  grader,
  date,
  authorName,
}: GradeGivenSectionProps) {
  const gradeParameters = [
    { name: "Content", result: "5/6" },
    { name: "Structure", result: "3/6" },
    { name: "Tone", result: "2/6" },
  ];

  return (
    <div className="rounded-3xl border border-[#DBDBDB] py-6 px-7.5 my-5 flex flex-col gap-6">
      <div className="flex flex-row gap-2.5">
        <div className="w-[38px] h-[38px] rounded-full bg-amber-300" />
        <div className="flex flex-col gap-2 mb-7.5">
          <p className="text-[#0C0C0C] text-base font-normal">
            {grader.gradedBy}
          </p>
          <p className="text-[14px] font-normal text-[#717171]">
            {grader.createdAt}
          </p>
        </div>
      </div>

      <p className="text-sm font-medium">Graded By: {grader.gradedBy}</p>
      <p className="text-sm text-gray-600">Grade: {grader.grade}/10</p>
      <p className="text-sm text-gray-500 italic">Comment: {grader.comment}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {gradeParameters.map((param, idx2) => (
          <GradeParametersView
            key={idx2}
            name={param.name}
            result={param.result}
          />
        ))}
      </div>
    </div>
  );
}
