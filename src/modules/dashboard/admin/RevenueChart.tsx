"use client";

import { ApiRevenueItem } from "@/types/admin.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// const data = [
//   { month: "Jan", value: 400 },
//   { month: "Feb", value: 300 },
//   { month: "Mar", value: 500 },
//   { month: "Apr", value: 200 },
//   { month: "May", value: 700 },
//   { month: "Jun", value: 600 },
//   { month: "Jul", value: 800 },
//   { month: "Aug", value: 500 },
//   { month: "Sep", value: 650 },
//   { month: "Oct", value: 400 },
//   { month: "Nov", value: 750 },
//   { month: "Dec", value: 900 },
// ];

export default function MonthlyBarChart({ data }: { data: ApiRevenueItem[] }) {
  // Convert { month, totalRevenue } → { month, value }
  const chartData = data.map((item) => ({
    month: item.month, // or format as "Jan", "Feb", etc.
    value: item.totalRevenue, // number
  }));
  return (
    <div className="w-full h-80 overflow-x-auto">
      <div className="min-w-[800px] h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20 }}
            barCategoryGap="20%" // space between groups of bars
            barGap={4}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            {/* Remove axes */}
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#368FFF"
              radius={[6, 6, 6, 6]}
              barSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
