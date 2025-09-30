import { login } from "@/services/auth.service";
import { subjectDomains } from "@/services/public.service";
import { useQuery } from "@tanstack/react-query";

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
