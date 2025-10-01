export interface loginFormDataTypes {
  email: string;
  password: string;
}

export interface SignupFormDataTypes {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  subjectDomains: string[];
}

export interface forgotPasswordFormDataTypes {
  email: string;
}
