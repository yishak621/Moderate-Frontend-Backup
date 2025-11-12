import { login } from "@/services/auth.service";
import {
  plansPublic,
  subjectDomains,
  createCheckoutSession,
  updatePlansApiData,
} from "@/services/public.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plan } from "@/types/admin.type";
import { queryClient } from "@/lib/queryClient";

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
      email,
    }: {
      planName: string;
      stripePriceId: string;
      email?: string;
    }) => createCheckoutSession(planName, stripePriceId, email),
  });

  return {
    createCheckout: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useUpdatePlansApiData() {
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Plan }) =>
      updatePlansApiData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allPlans"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    updatePlansApiData: mutation.mutate,
    updatePlansApiDataAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
