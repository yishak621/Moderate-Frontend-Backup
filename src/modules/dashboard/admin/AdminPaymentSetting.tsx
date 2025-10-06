"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  savings: string | null;
}

export default function AdminPaymentSetting() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "monthly",
      description: "Perfect for individuals",
      price: "9.99",
      currency: "USD",
      interval: "month",
      features: ["Full access", "Unlimited uploads"],
      isActive: true,
      isPopular: false,
      savings: null,
    },
    {
      id: "2",
      name: "yearly",
      description: "Best value for long-term use",
      price: "99.99",
      currency: "USD",
      interval: "year",
      features: ["Full access", "Unlimited uploads"],
      isActive: true,
      isPopular: true,
      savings: "Save ~17% vs monthly",
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleSave = (plan: Plan) => {
    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      setPlans([...plans, { ...plan, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setEditingPlan(null);
  };

  return (
    <section className="w-full mt-6 p-5 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manage Plans</h2>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {/* Plan list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition duration-200 bg-white relative"
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
                  onClick={() => handleEdit(plan)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPlan ? "Edit Plan" : "Create Plan"}
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="text-gray-600 hover:text-gray-800" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newPlan: Plan = {
                    id: editingPlan?.id || "",
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    price: formData.get("price") as string,
                    currency: "USD",
                    interval: formData.get("interval") as string,
                    features: ["Full access", "Unlimited uploads"],
                    isActive: true,
                    isPopular: false,
                    savings: null,
                  };
                  handleSave(newPlan);
                }}
                className="flex flex-col gap-4"
              >
                <input
                  name="name"
                  defaultValue={editingPlan?.name || ""}
                  placeholder="Plan name"
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  name="description"
                  defaultValue={editingPlan?.description || ""}
                  placeholder="Description"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingPlan?.price || ""}
                  placeholder="Price"
                  required
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <select
                  name="interval"
                  defaultValue={editingPlan?.interval || "month"}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>

                <button
                  type="submit"
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
