"use client";

import { useState } from "react";
import { UserCheck, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useUnbanUser } from "@/hooks/useModeration";
import { User } from "@/app/types/user";

interface UnbanUserModalProps {
  user: User;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function UnbanUserModal({
  user,
  onSuccess,
  onClose,
}: UnbanUserModalProps) {
  const { unbanUserAsync, isPending } = useUnbanUser();

  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }

    try {
      if (!user.id) {
        setError("User ID is required");
        return;
      }
      await unbanUserAsync(user.id, {
        reason: reason.trim(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to unban user");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <UserCheck className="text-green-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">Unban User</h2>
        </div>
        <p className="text-sm text-[#717171]">
          Unbanning: <span className="font-medium">{user.name}</span>
        </p>
      </div>

      {/* Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-green-800">
              Restoring User Access
            </p>
            <p className="text-xs text-green-800">
              Unbanning a user will restore their access to the platform. They will be
              able to login and perform actions again. Please provide a reason for this
              action.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Reason */}
        <div>
          <Textarea
            label="Unban Reason (Required)"
            placeholder="Enter a detailed reason for unbanning the user (minimum 10 characters)..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            required
            rows={5}
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reason.length}/10 characters minimum
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
            variant="green"
            disabled={isPending || reason.trim().length < 10}
          >
            {isPending ? "Unbanning..." : "Unban User"}
          </Button>
        </div>
      </form>
    </div>
  );
}

