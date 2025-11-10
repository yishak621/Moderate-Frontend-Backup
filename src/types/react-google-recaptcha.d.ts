declare module "react-google-recaptcha" {
  import { Component, RefObject, ForwardRefExoticComponent, RefAttributes } from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onError?: () => void;
    theme?: "light" | "dark";
    size?: "normal" | "compact" | "invisible";
    tabindex?: number;
    hl?: string;
  }

  export interface ReCAPTCHA {
    getValue(): string | null;
    reset(): void;
    execute(): void;
    executeAsync(): Promise<string>;
  }

  export interface ReactGoogleRecaptchaInstance extends ReCAPTCHA {}

  const ReactGoogleRecaptcha: ForwardRefExoticComponent<
    ReCAPTCHAProps & RefAttributes<ReactGoogleRecaptchaInstance>
  >;

  export default ReactGoogleRecaptcha;
}

