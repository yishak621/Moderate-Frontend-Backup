import { login } from "@/services/auth.service";
import {
  plansPublic,
  subjectDomains,
  createCheckoutSession,
} from "@/services/public.service";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useSubjectDomains() {
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["publicRoutes"],
    queryFn: subjectDomains, // must return a promise
    staleTime: Infinity,
  });

  return {
    subjectDomains: data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}

export function usePlansPublic() {
  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["plansPublic"],
    queryFn: plansPublic,
    staleTime: Infinity,
  });

  return {
    plans: data,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}

export function useCreateCheckoutSession() {
  const mutation = useMutation({
    mutationFn: ({
      planName,
      stripePriceId,
    }: {
      planName: string;
      stripePriceId: string;
    }) => createCheckoutSession(planName, stripePriceId),
  });

  return {
    createCheckout: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
