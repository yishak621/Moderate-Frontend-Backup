"use client";

import SectionHeader from "@/components/SectionHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ToggleSetting from "@/modules/dashboard/admin/ToggleSetting";
import { Bell, Globe, Settings, Shield, User } from "lucide-react";

export default function SettingsClientTeachers() {
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
            title="Profile"
            icon={User}
            subheader="Basic configuration and branding"
          />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Input type="text" placeholder="Site Name" label="Name" />
            <Input type="email" placeholder="Your Email" label="Email" />
          </div>
        </div>
      </div>
      {/* mid section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="Configure"
            icon={Settings}
            subheader="Control user registration and security settings"
          />

          <div className="flex flex-col mt-4">
            <ToggleSetting
              title="Enable private messaging"
              description="Control user registration and security settings"
              field="registration"
              defaultValue={false}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>

      {/* third section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="Notification"
            icon={Bell}
            subheader="Control user registration and security settings"
          />

          <div className="flex flex-col mt-4">
            <ToggleSetting
              title="Email alerts"
              description="Get notification through email"
              field="registration"
              defaultValue={false}
              onChange={handleToggleChange}
            />
            <ToggleSetting
              title="Push notification"
              description="Manage notification"
              field="notifications"
              defaultValue={true}
              onChange={handleToggleChange}
            />
            <ToggleSetting
              title="Weekly summary"
              description="Get summary info"
              field="notifications"
              defaultValue={true}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
