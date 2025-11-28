"use client";

import { X } from "lucide-react";
import { useEndImpersonation } from "@/hooks/UseAdminRoutes";
import {
  removeImpersonationToken,
  getRegularToken,
  getImpersonationToken,
  getToken,
  setRole,
} from "@/services/tokenService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { customJwtPayload } from "@/types/postAttributes";

export default function ImpersonationBanner() {
  const router = useRouter();
  const { endImpersonationAsync, isEndingImpersonation } =
    useEndImpersonation();

  const decoded = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      // Safely get impersonation token
      let impersonationToken: string | null = null;
      try {
        impersonationToken = getImpersonationToken() as string | null;
      } catch {
        impersonationToken = null;
      }

      const regularToken = getToken();
      const token = impersonationToken || regularToken;
      if (!token) return null;
      try {
        return jwtDecode(token) as customJwtPayload;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }, []);

  let isImpersonating = false;
  try {
    const impersonationToken = getImpersonationToken();
    isImpersonating = !!impersonationToken;
  } catch {
    isImpersonating = decoded?.impersonated === true;
  }
  const originalAdminEmail = decoded?.originalAdminEmail;
  const currentUserEmail = decoded?.email;

  if (!isImpersonating) {
    return null;
  }

  const handleEndImpersonation = async () => {
    try {
      try {
        const originalToken = getRegularToken();
        if (originalToken) {
          try {
            const decoded = jwtDecode(originalToken) as customJwtPayload;
            if (decoded?.role) {
              setRole(decoded.role);
            } else {
              setRole("SYSTEM_ADMIN");
            }
          } catch {
            setRole("SYSTEM_ADMIN");
          }
        } else {
          setRole("SYSTEM_ADMIN");
        }
      } catch {
        setRole("SYSTEM_ADMIN");
      }

      try {
        removeImpersonationToken();
      } catch {}

      toast.success("Returned to admin account");

      window.location.href = "/dashboard/admin/users";
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to end impersonation";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              You are viewing as{" "}
              <span className="font-semibold">{currentUserEmail}</span>
              {originalAdminEmail && (
                <>
                  {" "}
                  (Admin:{" "}
                  <span className="font-semibold">{originalAdminEmail}</span>)
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleEndImpersonation}
          disabled={isEndingImpersonation}
          className="ml-4 px-4 py-1.5 bg-white text-yellow-600 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isEndingImpersonation ? (
            <>
              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
              Ending...
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              End Impersonation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
