"use client";

import { SettingItem } from "@/app/types/user";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useUserData, useUserSaveSettings } from "@/hooks/useUser";
import ToggleSetting from "@/modules/dashboard/admin/ToggleSetting";
import { Bell, Globe, Settings, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SettingsClientTeachers() {
  const { user, isLoading, isSuccess } = useUserData();
  const [settings, setSettings] = useState<SettingItem>({});
  console.log(settings);
  const handleToggleChange = (value: boolean, field?: string) => {
    if (!field) return;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log({ [field]: value });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();

  const {
    saveSettings,
    saveSettingsAsync,
    isSavingSettingsLoading,
    isSavingSettingsSuccess,
  } = useUserSaveSettings();

  const onSubmit = async () => {
    try {
      // Await the login mutation
      const res = await saveSettingsAsync({ settings });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isSuccess && user?.settings) {
      setSettings(user.settings);
    }
  }, [isSuccess, user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-5">
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
              field="private_messaging"
              value={settings?.private_messaging ? true : false}
              onChange={handleToggleChange}
            />
          </div>

          <div className="flex flex-col mt-4">
            <ToggleSetting
              title="Online status"
              description="Show your online status to other users"
              field="online_status"
              value={settings?.online_status}
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
              field="email_alert"
              value={settings?.email_alert}
              onChange={handleToggleChange}
            />
            <ToggleSetting
              title="Push notification"
              description="Manage notification"
              field="push_notifications"
              value={settings?.push_notifications}
              onChange={handleToggleChange}
            />
            <ToggleSetting
              title="Weekly summary"
              description="Get summary info"
              field="weekly_summary"
              value={settings?.weekly_summary}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>
      <div className=" flex justify-end">
        {/* Button */}
        <Button
          type="submit"
          className={`justify-center  text-base cursor-pointer  transition 
        ${isSavingSettingsLoading && "opacity-70 cursor-not-allowed"}`}
        >
          {isSavingSettingsLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                ></path>
              </svg>
              Saving Settings...
            </>
          ) : (
            "Save Setting"
          )}
        </Button>
      </div>
    </form>
  );
}
