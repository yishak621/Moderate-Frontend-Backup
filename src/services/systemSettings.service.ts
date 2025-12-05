import { axiosInstance } from "@/lib/axiosInstance";

export interface SystemSettings {
  maintenance?: {
    enabled: boolean;
    message?: string;
  };
  [key: string]: any;
}

/**
 * Get system maintenance status
 * This is a public endpoint that doesn't require authentication
 */
export async function getMaintenanceStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/system/platform/maintenance`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      // If endpoint doesn't exist or fails, assume maintenance is off
      return false;
    }

    const data = await response.json();
    // Assuming the API returns { enabled: true/false } or similar
    return data?.enabled === true || data?.value === "true" || false;
  } catch (error) {
    // On error, assume maintenance is off to avoid blocking users
    console.error("Failed to fetch maintenance status:", error);
    return false;
  }
}

/**
 * Get all system settings (for admin use)
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const res = await axiosInstance.get("/api/system/platform");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch system settings:", error);
    throw error;
  }
}

