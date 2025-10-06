"use client";

import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ToggleSetting from "@/modules/dashboard/admin/ToggleSetting";
import { Globe, Shield } from "lucide-react";

export default function AdminSettingClient() {
  const siteName = "Moderate Tech";
  const handleToggleChange = (value: boolean, field?: string) => {
    if (!field) return;
    console.log({ [field]: value });
    // Example output: { registration: true }
  };

  return (
    <div className=" flex flex-col gap-5">
      {/* top section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="General Settings"
            icon={Globe}
            subheader="Basic platform configuration and branding"
          />
          <div className="mt-10">
            <Input type="text" placeholder="Site Name" label="Site Name" />
          </div>
          <div className="mt-10">
            <Textarea placeholder="Site Description" label="Site Description" />
          </div>
        </div>
      </div>
      {/* mid section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="User Registration & Security"
            icon={Shield}
            subheader="Control user registration and security settings"
          />

          <div className="flex flex-col mt-10">
            <ToggleSetting
              title="Allow New Registrations"
              description="Control user registration and security settings"
              field="registration"
              defaultValue={false}
              onChange={handleToggleChange}
            />
            <ToggleSetting
              title="Enable Notifications"
              description="Allow system notifications for all users"
              field="notifications"
              defaultValue={true}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>

      {/* third section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="Payment & Subscription Settings"
            icon={Globe}
            subheader="Configure Stripe integration and pricing plans"
          />
        </div>
      </div>
    </div>
  );
}
