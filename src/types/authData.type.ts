export interface loginFormDataTypes {
  email: string;
  password: string;
}

export interface domainVerifyFormDataTypes {
  email: string;
  teacherEmail: string;
}
export interface SignupFormDataTypes {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  subjectDomains: string[];
  role?: string;
}

export interface forgotPasswordFormDataTypes {
  email: string;
}

export interface ResetPasswordFormDataTypes {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPropsTypes {
  data: ResetPasswordFormDataTypes;
  resetToken: string;
}
