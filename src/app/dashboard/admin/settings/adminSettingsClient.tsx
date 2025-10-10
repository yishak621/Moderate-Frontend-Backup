"use client";

import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  useAdminAllSiteSettings,
  useAdminUpdateSiteSetting,
} from "@/hooks/UseAdminRoutes";
import AdminPaymentSetting from "@/modules/dashboard/admin/AdminPaymentSetting";
import ToggleSetting from "@/modules/dashboard/admin/ToggleSetting";
import { Setting } from "@/types/admin.type";
import { Globe, Loader, Plus, Settings, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getBasicSettingsColumns } from "./columns";
import DataTable from "@/components/table/Table";
import Modal from "@/components/ui/Modal";
import CreateNewSettingModal from "@/modules/dashboard/admin/modal/settings/CreateNewSettingModal";
import CreateNewPlanModal from "@/modules/dashboard/admin/modal/plans/CreateNewPlanModal";

export default function AdminSettingClient() {
  // const siteName = "Moderate Tech";
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const [ModalComponent, setModalComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  const handleOpenModal = <P,>(
    component: React.ComponentType<P>,
    props?: P
  ) => {
    setModalComponent(() => component);
    setModalProps(props || {});
    setOpen(true);
  };

  const basicSettingsColumns = getBasicSettingsColumns(handleOpenModal);
  // const emailDomainColumns = getEmailDomainsColumns(handleOpenModal);

  const handleToggleChange = (value: boolean, field?: string) => {
    if (!field) return;
    console.log({ [field]: value });
    // Example output: { registration: true }
  };

  //react hook form
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    watch,
  } = useForm<Setting>();

  const {
    allSiteSettings,
    isSiteSettingsLoading,
    isSiteSettingsSuccess,
    allSiteSettingsError,
  } = useAdminAllSiteSettings(page);

  return (
    <div className=" flex flex-col gap-5">
      {/* top section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <div className=" flex flex-row justify-between items-center">
            <SectionHeader
              title="General Settings"
              icon={Globe}
              subheader="Basic platform configuration and branding"
            />

            <Button
              icon={<Plus size={23} />}
              onClick={() => handleOpenModal(CreateNewSettingModal)}
            >
              Create New Setting
            </Button>
          </div>
          {/* table */}
          <div className="px-0 p-6">
            {isSiteSettingsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin" size={32} />
              </div>
            ) : (
              <DataTable<Setting>
                data={allSiteSettings?.settings || []}
                columns={basicSettingsColumns}
              />
            )}
            <Modal isOpen={open} onOpenChange={setOpen}>
              <Modal.Content>
                {ModalComponent && <ModalComponent {...modalProps} />}
              </Modal.Content>
            </Modal>
          </div>
        </div>
      </div>
      {/* mid section */}
      {/* <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
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
      </div> */}

      {/* third section */}
      <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
        <div className="flex flex-col">
          <div className=" flex flex-row justify-between items-center">
            <SectionHeader
              title="Payment & Subscription Settings"
              icon={Globe}
              subheader="Configure Stripe integration and pricing plans"
            />
            <Button
              icon={<Plus size={23} />}
              onClick={() => handleOpenModal(CreateNewPlanModal)}
            >
              Create New Plan
            </Button>
          </div>

          <AdminPaymentSetting />
        </div>
      </div>

      {/* forth section */}
      {/* <div className=" flex flex-col py-[30px] px-6 rounded-[37px] bg-[#FDFDFD]">
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
      </div> */}
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
