import { useMutation } from "@tanstack/react-query";
import { createBillingPortalSession } from "@/services/subscription.service";
import toast from "react-hot-toast";

//-------------------CREATE BILLING PORTAL SESSION

export function useBillingPortal() {
  const mutation = useMutation({
    mutationFn: () => createBillingPortalSession(),
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to open billing portal");
      } else {
        toast.error("Failed to open billing portal");
      }
    },
  });

  return {
    createBillingPortal: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

