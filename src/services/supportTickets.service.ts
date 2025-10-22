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
export const listAllTickets = async () => {
  try {
    const res = await axiosInstance.get("/api/support/admin/tickets");
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
      { message }
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
