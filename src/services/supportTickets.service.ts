import {
  CreateTicketInput,
  SendMessageTicketInput,
  Ticket,
} from "@/app/types/support_tickets";
import { axiosInstance } from "@/lib/axiosInstance";
import { AxiosError } from "axios";

//------------------- CREATE SUPPORT TICKET -- USER
export const createSupportTicket = async (data: CreateTicketInput) => {
  try {
    const res = await axiosInstance.post("/api/support/tickets", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- CREATE SUPPORT TICKET -- ADMIN
export const createSupportTicketAdmin = async (data: CreateTicketInput) => {
  try {
    const res = await axiosInstance.post("/api/support/admin/tickets", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- POST MESSAGE TO A TICKET (USER OR ADMIN)
export const postSupportMessage = async ({
  ticketId,
  message,
  sender,
}: SendMessageTicketInput) => {
  try {
    const res = await axiosInstance.post(
      `/api/support/tickets/${ticketId}/messages`,
      { message, sender }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- USER: GET SUPPORT STATS
export const getAllSupportTickets = async () => {
  try {
    const res = await axiosInstance.get("/api/support/tickets");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- ADMIN: GET SUPPORT STATS
export const getSupportStats = async () => {
  try {
    const res = await axiosInstance.get("/api/support/admin/support/stats");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- ADMIN: LIST ALL TICKETS
type ListTicketsParams = {
  search?: string;
  curricular?: string;
  page?: number;
  limit?: number;
};

export const listAllTickets = async (params: ListTicketsParams = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.curricular) searchParams.set("curricular", params.curricular);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/support/admin/tickets?${queryString}`
      : "/api/support/admin/tickets";

    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- BOTH: GET TICKET MESSAGES
export const getTicketMessages = async (ticketId: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/support/tickets/${ticketId}/messages`
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- ADMIN: POST MESSAGE TO A TICKET
export const postAdminMessage = async ({
  ticketId,
  message,
}: {
  ticketId: string;
  message: string;
}) => {
  try {
    const res = await axiosInstance.post(
      `/api/support/admin/tickets/${ticketId}/messages`,
      { sender: "admin", message }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- ADMIN: CLOSE TICKET
export const closeTicket = async (ticketId: string) => {
  try {
    const res = await axiosInstance.post(
      `/api/support/admin/tickets/${ticketId}/close`
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//------------------- GET UNREAD SUPPORT TICKETS COUNT
// Note: This endpoint may not exist yet on the backend
// It should return { count: number } for unread support tickets
// For users: /api/support/tickets/unread-count
// For admins: /api/support/admin/tickets/unread-count (if different)
let hasLogged404 = false; // Track if we've already logged the 404
export const getUnreadSupportTicketsCount = async () => {
  try {
    // Try user endpoint first (works for both user and admin if backend handles role)
    const res = await axiosInstance.get("/api/support/tickets/unread-count");
    hasLogged404 = false; // Reset if successful
    return res.data;
  } catch (error) {
    // If endpoint doesn't exist (404) or other error, return default count
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        // Endpoint doesn't exist yet, return default
        // Only log once to avoid console spam
        if (!hasLogged404) {
          console.warn(
            "Unread support tickets count endpoint not implemented yet. Returning 0."
          );
          hasLogged404 = true;
        }
        return { count: 0 };
      }
      // For other errors, log but still return default
      console.warn(
        "Failed to fetch unread support tickets count:",
        error.response?.data || error.message
      );
      return { count: 0 };
    }
    // For non-axios errors, return default
    console.warn("Failed to fetch unread support tickets count:", error);
    return { count: 0 };
  }
};

//------------------- Helper Function
const handleApiError = (error: unknown) => {
  if (isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  } else if (error instanceof Error) {
    console.error("General Error:", error.message);
    throw new Error(error.message || "Something went wrong");
  } else {
    console.error("Unknown error:", error);
    throw new Error("Something went wrong");
  }
};

//------------------- Type Guard for AxiosError
const isAxiosError = (error: unknown): error is AxiosError<any> => {
  return (error as AxiosError)?.isAxiosError === true;
};
