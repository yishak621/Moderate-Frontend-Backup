"use client";

import { useState } from "react";
import { Ban, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useBanUser } from "@/hooks/useModeration";
import { User } from "@/app/types/user";

interface BanUserModalProps {
  user: User;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function BanUserModal({ user, onSuccess, onClose }: BanUserModalProps) {
  const { banUserAsync, isPending } = useBanUser();

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
      await banUserAsync(user.id, {
        reason: reason.trim(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to ban user");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Ban className="text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-[#0c0c0c]">Ban User</h2>
        </div>
        <p className="text-sm text-[#717171]">
          Banning: <span className="font-medium">{user.name}</span>
        </p>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-red-800">Warning: Permanent Action</p>
            <p className="text-xs text-red-800">
              Banning a user is a permanent action that will prevent them from accessing the
              platform. They will not be able to login or perform any actions. This action can be
              reversed by an admin, but it requires manual intervention.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Reason */}
        <div>
          <Textarea
            label="Ban Reason (Required)"
            placeholder="Enter a detailed reason for the ban (minimum 10 characters)..."
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
            variant="red"
            disabled={isPending || reason.trim().length < 10}
          >
            {isPending ? "Banning..." : "Ban User"}
          </Button>
        </div>
      </form>
    </div>
  );
}

