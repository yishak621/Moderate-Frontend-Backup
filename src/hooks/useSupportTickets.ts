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
} from "@/services/supportTickets.service";
import { CreateTicketInput, Ticket } from "@/app/types/support_tickets";

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
export const useAllSupportTickets = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-support-tickets"],
    queryFn: listAllTickets,
  });

  return {
    tickets: data,
    isTicketsLoading: isLoading,
    isTicketsError: isError,
    ticketsError: error,
    refetchTickets: refetch,
  };
};

//-------------------- ADMIN: GET TICKET MESSAGES
export const useTicketMessages = (ticketId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId,
    retry: 3,
  });

  return {
    messages: data,
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
