"use client";

import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useSuspendUser } from "@/hooks/useModeration";
import { User } from "@/app/types/user";

interface SuspendUserModalProps {
  user: User;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function SuspendUserModal({ user, onSuccess, onClose }: SuspendUserModalProps) {
  const { suspendUserAsync, isPending } = useSuspendUser();

  const [duration, setDuration] = useState<number>(7); // Default 7 days
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (duration < 1) {
      setError("Duration must be at least 1 day");
      return;
    }

      try {
      if (!user.id) {
        setError("User ID is required");
        return;
      }
      await suspendUserAsync(user.id, {
        duration,
        reason: reason.trim() || undefined,
      });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to suspend user");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="text-orange-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">Suspend User</h2>
        </div>
        <p className="text-sm text-[#717171]">
          Suspending: <span className="font-medium">{user.name}</span>
        </p>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-orange-800">
            Suspending a user will restrict their access to the platform for the specified duration.
            They will be able to login but cannot perform actions until the suspension expires.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Duration */}
        <div>
          <Input
            label="Suspension Duration (Days)"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              setError("");
            }}
            required
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            The user will be suspended for this many days
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {/* Reason */}
        <div>
          <Textarea
            label="Reason (Optional)"
            placeholder="Enter a reason for the suspension..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
            disabled={isPending}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="red"
            disabled={isPending || duration < 1}
          >
            {isPending ? "Suspending..." : "Suspend User"}
          </Button>
        </div>
      </form>
    </div>
  );
}

