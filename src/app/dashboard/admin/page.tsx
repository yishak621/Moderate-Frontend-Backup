"use client";

import StatsCard from "@/modules/dashboard/StatsCards";

type StatsCardProps = {
  title: string;
  count: number;
  description: string;
};

const statsData: StatsCardProps[] = [
  {
    title: "Total Teachers",
    count: 243,
    description: "+12% from last month",
  },
  {
    title: "Active Schools",
    count: 45,
    description: "+2 from last month",
  },
  {
    title: "Documents Uploaded",
    count: 1847,
    description: "+12% from last month",
  },
];
//--------------------------OVERVIEW DASHBOARD
export default function AdminPage() {
  return (
    <div className="flex flex-col">
      {/* first section */}
      <div className="flex flex-row gap-6 mb-5.5 rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7">
        {statsData.map((stat) => {
          return (
            <StatsCard
              key={stat.title}
              title={stat.title}
              count={stat.count}
              description={stat.description}
            />
          );
        })}
      </div>
      {/* second section */}
      <div className="h-screen w-full rounded-[37px] bg-[#FDFDFD]  p-6 grid grid-cols-[74%_26%] gap-6 md:grid-cols-[65%_35%] sm:grid-cols-1">
          <div className="bg-blue-200 p-6">Left Content</div>
  <div className="bg-green-200 p-6">Right Content</div>
      </div>
    </div>
  );
}
