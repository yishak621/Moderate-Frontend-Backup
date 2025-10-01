"use client";

import Modal from "@/components/ui/Modal";
import AddTeacherModal from "@/modules/dashboard/admin/modal/AddTeacherModal";
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
  Megaphone,
  Settings,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import CreateNewAnnouncementModal from "@/modules/dashboard/admin/modal/CreateNewAnnouncementModal";
import { StatsCardProps } from "@/types/statusCardProps";
import { useAdminOverviewData } from "@/hooks/UseAdminRoutes";
import { ApiRevenueItem } from "@/types/admin.type";

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
  {
    icon: <UserPlus width={23} height={23} />,
    label: "Add New Teacher",
    component: AddTeacherModal,
  },
  {
    icon: <Download width={23} height={23} />,
    label: "Export Data",
    component: AddTeacherModal,
  },
  {
    icon: <Megaphone width={23} height={23} />,
    label: "Create Announcement",
    component: CreateNewAnnouncementModal,
  },
  {
    icon: <Settings width={23} height={23} />,
    label: "Settings",
    component: AddTeacherModal,
  },
];
//--------------------------OVERVIEW DASHBOARD
export default function AdminPage() {
  const {
    overview,
    isLoading: isOverviewLoading,
    isSuccess: isOverviewSuccess,
    isError: isOverviewError,
    error: overviewError,
  } = useAdminOverviewData();
  // Map revenueByMonth to chart-friendly format
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Map API data to a Map
  const revenueMap = new Map<number, number>(
    overview?.revenueByMonth.map(
      (item: { month: string; totalRevenue: string }) => [
        new Date(item.month).getMonth(),
        Number(item.totalRevenue) / 100, // convert cents to USD
      ]
    )
  );

  // Map to chart-ready array
  const revenueChartData: ApiRevenueItem[] = months.map((month, idx) => {
    // Find revenue for this month
    const revenueEntry = overview?.revenueByMonth.find(
      (item) => new Date(item.month).getMonth() === idx
    );
    return {
      month,
      totalRevenue: revenueEntry ? Number(revenueEntry.totalRevenue) / 100 : 0,
    };
  });

  console.log(revenueChartData, revenueMap);
  // Calculate annual revenue
  const annualRevenue = revenueChartData.reduce(
    (acc: number, item: ApiRevenueItem) => acc + item.totalRevenue,
    0
  );

  const statsData: StatsCardProps[] = [
    {
      title: "Total Teachers",
      count: overview?.totalTeachers,
      description: "+12% from last month",
      colored: true,
    },
    {
      title: "Active Schools",
      count: overview?.activeSchools,
      description: "+2 from last month",
      colored: false,
    },
    {
      title: "Documents Uploaded",
      count: overview?.postsCreated,
      description: "+12% from last month",
      colored: false,
    },
  ];
  //MODAL STATES
  const [open, setOpen] = useState(false);
  const [ModalComponent, setModalComponent] = useState<React.FC | null>(null);

  const handleOpenModal = (Component: React.FC) => {
    setModalComponent(() => Component); // store the component to render
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-5.5">
      {/* first section */}
      <div className="flex flex-row gap-6  rounded-[37px] 3xl:gap-12 justify-between bg-[#FDFDFD]  max-h-[285px] p-7 ">
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
        <div className="grid gap-6 md:grid-cols-[65%_35%] grid-cols-1">
          {/* left side */}
          <div className="p-6 w-full">
            {/* left top */}
            <div className="flex flex-row justify-between mb-5 flex-wrap">
              <div className="flex flex-col">
                <p className="text-xl font-medium text-[#0C0C0C]">
                  Annual Revenue{`(${annualRevenue}$)`}
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
              <RevenueChart data={revenueChartData} />
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
        <div className="pt-15 flex flex-row gap-7 justify-between">
          {buttonData.map((btn, idx) => (
            <DashboardButton
              key={idx}
              icon={btn.icon}
              label={btn.label}
              onClick={() => handleOpenModal(btn.component!)}
            />
          ))}
          {/* VERY IMPORTANT */}
          <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Content>
              {ModalComponent && <ModalComponent />}{" "}
              {/* render dynamic component */}
            </Modal.Content>
          </Modal>
        </div>
      </div>
    </div>
  );
}
