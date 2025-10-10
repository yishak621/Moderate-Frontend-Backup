"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useAdminAllPlans } from "@/hooks/UseAdminRoutes";
import CreateNewPlanModal from "./modal/plans/CreateNewPlanModal";
import EditPlanModal from "./modal/plans/EditPlanModal";
import DeletePlanModal from "./modal/plans/DeletePlanModal";
import Modal from "@/components/ui/Modal";
import { Plan } from "@/types/admin.type";

export default function AdminPaymentSetting() {
  const {
    allPlans,
    allPlansError,
    isPlansLoading,
    isPlansSuccess,
    isPlansError,
  } = useAdminAllPlans();

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

  // const handleDelete = (id: string) => {
  //   setPlans(plans.filter((plan) => plan.id !== id));
  // };

  // const handleSave = (plan: Plan) => {
  //   if (editingPlan) {
  //     setPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
  //   } else {
  //     setPlans([...plans, { ...plan, id: Date.now().toString() }]);
  //   }
  //   setShowModal(false);
  //   setEditingPlan(null);
  // };

  return (
    <section className="w-full mt-6 p-5 sm:p-8 flex flex-col gap-6">
      {/* Plan list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {allPlans?.data.map((plan: Plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`border rounded-xl p-5 flex flex-col justify-between transition duration-200 relative
  ${
    plan.isActive
      ? "border-gray-200 bg-white hover:shadow-md"
      : "border-gray-300 bg-gray-100 opacity-75"
  }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-medium text-gray-900 px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    /{plan.interval}
                  </span>
                </div>
                {plan.savings && (
                  <p className="text-xs text-green-600 font-medium">
                    {plan.savings}
                  </p>
                )}
                <ul className="mt-3 space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      ✅ {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    handleOpenModal(EditPlanModal, {
                      Plan: plan,
                    })
                  }
                  className="flex items-center cursor-pointer gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() =>
                    handleOpenModal(DeletePlanModal, {
                      Plan: plan,
                    })
                  }
                  className="flex items-center cursor-pointer gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <Modal isOpen={open} onOpenChange={setOpen}>
                  <Modal.Content>
                    {ModalComponent && <ModalComponent {...modalProps} />}
                  </Modal.Content>
                </Modal>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
