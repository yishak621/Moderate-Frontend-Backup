"use client";

import DashboardNotificationItem from "@/modules/dashboard/admin/DashboardNotificationItem";
import RevenueChart from "@/modules/dashboard/admin/RevenueChart";
import DashboardButton from "@/modules/dashboard/DashboardButton";
import StatsCard from "@/modules/dashboard/StatsCards";
import {
  ArrowBigDown,
  ArrowDown,
  ArrowDown01,
  ChevronDown,
  Circle,
  Download,
  Settings,
  UserPlus,
} from "lucide-react";

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

const notifications = [
  {
    statusColor: "bg-green-500",
    title: "New teacher registered: john.doe@westfield.edu",
    time: "2 minutes ago",
  },
  {
    statusColor: "bg-yellow-500",
    title: "Assignment pending approval: math101",
    time: "10 minutes ago",
  },
];

const buttonData = [
  { icon: <UserPlus width={23} height={23} />, label: "Add New Teacher" },
  { icon: <Download width={23} height={23} />, label: "Export Data" },
  { icon: <Settings width={23} height={23} />, label: "Settings" },
  { icon: <Settings width={23} height={23} />, label: "Settings" },
];
//--------------------------OVERVIEW DASHBOARD
export default function AdminPage() {
  return (
    <div className="flex flex-col ">
      {/* first section */}
      <div className="flex flex-row gap-6 mb-5.5 rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7 ">
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

      <div className="h-screen rounded-[37px] bg-[#FDFDFD] p-6 max-w-full overflow-hidden ">
        <div
          className="   
    grid gap-6 
    md:grid-cols-[65%_35%] 
    grid-cols-1"
        >
          {/* left side */}
          <div className="p-6 w-full">
            {/* left top */}
            <div className="flex flex-row justify-between mb-5 flex-wrap">
              <div className="flex flex-col">
                <p className="text-xl font-medium text-[#0C0C0C]">
                  Annual Revenue(2500$)
                </p>
                <p className="text-base font-normal text-[#717171]">
                  Latest system events and user actions
                </p>
              </div>

              <div className="flex flex-row gap-5 text-[#0C0C0C] text-base font-normal flex-wrap">
                <button className="flex flex-row gap-1 justify-center items-center rounded-[24.5px] py-3.5 px-4.5 border border-[#DBDBDB]">
                  Export <Download width={22} height={22} />
                </button>
                <button className="flex flex-row gap-1 justify-center items-center rounded-[24.5px] py-3.5 px-4.5 border border-[#DBDBDB]">
                  2025 <ChevronDown width={22} height={22} />
                </button>
              </div>
            </div>

            {/* left bottom */}
            <div className="w-full overflow-x-auto">
              <RevenueChart />
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col gap-8 w-full">
            {/* right title block */}
            <div className="flex flex-col gap-2 ">
              <p className="text-[#0C0C0C] text-xl font-medium">
                Recent Activity
              </p>
              <p className="text-[#717171] font-normal text-base">
                Latest system events and user actions
              </p>
            </div>

            {/* right bottom */}
            <div className="flex flex-col gap-6  overflow-hidden">
              {notifications.map((item, idx) => (
                <DashboardNotificationItem
                  key={idx}
                  statusColor={item.statusColor}
                  title={item.title}
                  time={item.time}
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOOTM */}
        <div className="pt-15 flex flex-row justify-between">
          {buttonData.map((btn, idx) => (
            <DashboardButton key={idx} icon={btn.icon} label={btn.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
