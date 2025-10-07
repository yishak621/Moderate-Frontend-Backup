"use client";

import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useAdminAllSiteSettings } from "@/hooks/UseAdminRoutes";
import AdminPaymentSetting from "@/modules/dashboard/admin/AdminPaymentSetting";
import ToggleSetting from "@/modules/dashboard/admin/ToggleSetting";
import { Setting } from "@/types/admin.type";
import { Globe, Settings, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminSettingClient() {
  // const siteName = "Moderate Tech";
  const [page, setPage] = useState(1);
  const handleToggleChange = (value: boolean, field?: string) => {
    if (!field) return;
    console.log({ [field]: value });
    // Example output: { registration: true }
  };
  const {
    allSiteSettings,
    isSiteSettingsLoading,
    isSiteSettingsSuccess,
    allSiteSettingsError,
  } = useAdminAllSiteSettings(page);

  const siteName = allSiteSettings?.settings.find(
    (setting: Setting) => setting.key === "site-name"
  );
  const sitedescription = allSiteSettings?.settings.find(
    (setting: Setting) => setting.key === "site-description"
  );

  console.log(siteName, sitedescription, "all");

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
          <div className="mt-6 xl:mt-10">
            <Input
              type="text"
              placeholder="Site Name"
              label="Site Name"
              defaultValue={siteName?.value[0]}
            />
          </div>
          <div className="mt-6 xl:mt-10">
            <Textarea
              placeholder="Site Description"
              label="Site Description"
              defaultValue={sitedescription?.value[0]}
            />
          </div>

          <div className=" flex flex-row self-end gap-2">
            <div className="  mt-2.5">
              <Button variant="secondary">Add New Setting</Button>
            </div>
            <div className="  mt-2.5">
              <Button>Save Changes</Button>
            </div>
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

          <div className=" self-end mt-2.5">
            <Button>Save Changes</Button>
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
          <AdminPaymentSetting />
        </div>
      </div>

      {/* forth section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="System Setting"
            icon={Settings}
            subheader="System-wide configuration and maintenance options"
          />

          <div className="flex flex-col mt-10">
            <ToggleSetting
              title="Maintenance Mode"
              description="Temporarily disable access to the platform for maintenance"
              field="registration"
              defaultValue={false}
              onChange={handleToggleChange}
            />
          </div>

          <div className=" self-end mt-2.5">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <SectionHeader
            title="Static Pages Content"
            icon={Globe}
            subheader="Manage content for Terms of Service, Privacy Policy, and About page"
          />

          <div className="mt-6 xl:mt-10">
            <Textarea
              placeholder="Enter Terms of Service content..."
              label="Terms of Service"
            />
          </div>

          <div className="mt-6 xl:mt-10">
            <Textarea
              placeholder="Privacy Policy"
              label="Enter Privacy Policy content.."
            />
          </div>
          <div className="mt-6 xl:mt-10">
            <Textarea
              placeholder="About Page"
              label="Enter About Page content.."
            />
          </div>
          <div className=" self-end mt-2.5">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
