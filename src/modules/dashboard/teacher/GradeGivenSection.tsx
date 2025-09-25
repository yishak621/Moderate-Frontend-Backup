import { GradeParametersType } from "@/types/GradeParameters";
import GradeParametersView from "./GradeParametersView";

const GradeParameters: GradeParametersType[] = [
  { name: "Content", result: "5/6" },
  { name: "Structure", result: "3/6" },
  { name: "Tone", result: "2/6" },
  { name: "Content", result: "5/6" },
  { name: "Structure", result: "3/6" },
  { name: "Tone", result: "2/6" },
];

export default function GradeGivenSection() {
  return (
    <div className=" rounded-3xl border border-[#DBDBDB] py-6 px-7.5 my-5 flex flex-col">
      {/* top section */}
      <div className=" flex flex-row gap-2.5">
        <div className=" w-[38px] h-[38px] rounded-full bg-amber-300"></div>
        <div className="flex flex-col gap-2 mb-7.5">
          <p className=" text-[#0C0C0C] text-base font-normal">Sarah Johnson</p>
          <p className="text-[14px] font-normal text-[#717171]">Aug 23</p>
        </div>
      </div>
      {/* medium section */}
      <div className=" border-green-400 border-l-4 pl-3">
        Controls what users can do after authentication through three main
        models: RBAC assigns permissions to roles, ABAC uses attributes and
        context for fine-grained control, and ACL attaches permissions to
        individual resources. Real applications like GitHub and Stripe often
        combine these models. OAuth2 enables delegated authorization without
        sharing credentials.
      </div>
      <div className="  border-green-400 border-l-4 pl-3 my-6">25/40 - A+</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GradeParameters.map((param, idx) => (
          <GradeParametersView
            key={idx}
            name={param.name}
            result={param.result}
          />
        ))}
      </div>
    </div>
  );
}
