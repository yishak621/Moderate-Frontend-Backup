import { forgotPassword, login, signup } from "@/services/auth.service";
import {
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: loginFormDataTypes) => login(data),
    });

  return {
    login: mutate,
    loginAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}

export function useSignup() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: SignupFormDataTypes) => signup(data),
    });

  return {
    signup: mutate,
    signupAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}

export function useForgotPassword() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: forgotPasswordFormDataTypes) => forgotPassword(data),
    });

  return {
    forgotPassword: mutate,
    forgotPasswordAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}
