import { login, signup } from "@/services/auth.service";
import { loginData } from "@/types/authData";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: loginData) => login(data),
    });

  return {
    login: mutate,
    loginAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
  };
}

export function useSignup() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: loginData) => signup(data),
    });

  return {
    signup: mutate,
    signupAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
  };
}
