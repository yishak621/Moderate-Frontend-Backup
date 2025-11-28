import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSupportTicket,
  postSupportMessage,
  getSupportStats,
  listAllTickets,
  getTicketMessages,
  postAdminMessage,
  closeTicket,
  getAllSupportTickets,
  createSupportTicketAdmin,
  getUnreadSupportTicketsCount,
} from "@/services/supportTickets.service";
import { CreateTicketInput, Ticket } from "@/app/types/support_tickets";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";

//-------------------- CREATE SUPPORT TICKET
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createTicket,
    mutateAsync: createTicketAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateTicketInput) => createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-support-tickets"] });
    },
  });

  return {
    createTicket,
    createTicketAsync,
    data,
    isCreatingTicketLoading: isPending,
    isCreatingTicketSuccess: isSuccess,
    isCreatingTicketError: isError,
    creatingTicketError: error,
  };
};

//-------------------- CREATE SUPPORT TICKET ADMIN
export const useCreateSupportTicketAdmin = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createTicket,
    mutateAsync: createTicketAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: CreateTicketInput) => createSupportTicketAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
    },
  });

  return {
    createTicket,
    createTicketAsync,
    data,
    isCreatingTicketLoading: isPending,
    isCreatingTicketSuccess: isSuccess,
    isCreatingTicketError: isError,
    creatingTicketError: error,
  };
};

//-------------------- POST SUPPORT MESSAGE (User)
export const usePostSupportMessage = () => {
  const queryClient = useQueryClient();

  const {
    mutate: sendMessage,
    mutateAsync: sendMessageAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: postSupportMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages"] });
    },
  });

  return {
    sendMessage,
    sendMessageAsync,
    data,
    isSendingMessageLoading: isPending,
    isSendingMessageSuccess: isSuccess,
    isSendingMessageError: isError,
    sendingMessageError: error,
  };
};

//-------------------- USER: LIST ALL SUPPORT TICKETS
export const useGetAllSupportTickets = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-support-tickets"],
    queryFn: getAllSupportTickets,
  });

  return {
    tickets: data,
    isTicketsLoading: isLoading,
    isTicketsError: isError,
    ticketsError: error,
    refetchTickets: refetch,
  };
};

//-------------------- ADMIN: LIST ALL SUPPORT TICKETS
type SupportTicketsQuery = {
  search?: string;
  curricular?: string;
  page?: number;
  limit?: number;
};

export const useAllSupportTickets = ({
  search = "",
  curricular = "",
  page = 1,
  limit = 10,
}: SupportTicketsQuery = {}) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const query = useQuery({
    queryKey: [
      "admin-support-tickets",
      page,
      curricular,
      debouncedSearch,
      limit,
    ],
    queryFn: () =>
      listAllTickets({
        search: debouncedSearch,
        curricular,
        page,
        limit,
      }),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });

  return {
    tickets: query.data,
    isTicketsLoading: query.isPending,
    isTicketsFetching: query.isFetching,
    isTicketsError: query.isError,
    ticketsError: query.error,
    refetchTickets: query.refetch,
  };
};

//-------------------- ADMIN: GET TICKET AND MESSAGES
export const useTicketMessages = (ticketId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId,
    retry: 3,
    refetchOnWindowFocus: true, // Enable refetching when the window regains focus
  });

  return {
    messages: data?.messages,
    ticket: data?.ticket,
    isMessagesLoading: isLoading,
    isMessagesError: isError,
    messagesError: error,
    refetchMessages: refetch,
  };
};

//-------------------- ADMIN: POST ADMIN MESSAGE
export const usePostAdminMessage = () => {
  const queryClient = useQueryClient();

  const {
    mutate: sendAdminMessage,
    mutateAsync: sendAdminMessageAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: postAdminMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages"] });
    },
  });

  return {
    sendAdminMessage,
    sendAdminMessageAsync,
    data,
    isSendingAdminMessageLoading: isPending,
    isSendingAdminMessageSuccess: isSuccess,
    isSendingAdminMessageError: isError,
    sendingAdminMessageError: error,
  };
};

//-------------------- ADMIN: CLOSE TICKET
export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  const {
    mutate: closeTicketMutate,
    mutateAsync: closeTicketAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: closeTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-stats"] });
    },
  });

  return {
    closeTicket: closeTicketMutate,
    closeTicketAsync,
    data,
    isClosingTicketLoading: isPending,
    isClosingTicketSuccess: isSuccess,
    isClosingTicketError: isError,
    closingTicketError: error,
  };
};

//-------------------- ADMIN: GET SUPPORT STATS
export const useSupportStats = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["support-stats"],
    queryFn: getSupportStats,
  });

  return {
    stats: data,
    isStatsLoading: isLoading,
    isStatsError: isError,
    statsError: error,
    refetchStats: refetch,
  };
};

//-------------------- GET UNREAD SUPPORT TICKETS COUNT
export const useUnreadSupportTicketsCount = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["unread-support-tickets-count"],
    queryFn: async () => {
      try {
        return await getUnreadSupportTicketsCount();
      } catch (err) {
        // If endpoint doesn't exist yet or fails, return 0 count
        console.warn("Failed to fetch unread support tickets count:", err);
        return { count: 0 };
      }
    },
    staleTime: 60000, // 1 minute - data is fresh for 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchInterval: 30000, // Refetch every 30 seconds to keep count updated
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1, // Only retry once since we have a fallback
  });

  return {
    unreadCount: data?.count || 0,
    isLoading,
    isError,
    error,
  };
};
