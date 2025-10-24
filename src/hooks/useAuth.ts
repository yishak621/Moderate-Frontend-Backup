import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyDomainAdmin,
} from "@/services/auth.service";
import {
  domainVerifyFormDataTypes,
  forgotPasswordFormDataTypes,
  loginFormDataTypes,
  ResetPasswordFormDataTypes,
  ResetPasswordPropsTypes,
  SignupFormDataTypes,
} from "@/types/authData.type";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

export function useResetPassword() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: ({ data, resetToken }: ResetPasswordPropsTypes) =>
        resetPassword({ data, resetToken }),
    });

  return {
    resetPassword: mutate,
    resetPasswordAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}

export function useDomainVerify() {
  const { mutate, mutateAsync, data, isPending, isSuccess, isError, error } =
    useMutation({
      mutationFn: (data: domainVerifyFormDataTypes) => verifyDomainAdmin(data),
      onSuccess: () => {
        toast.success("Verification link sent successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return {
    domainVerify: mutate,
    domainVerifyAsync: mutateAsync,
    user: data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
  };
}
