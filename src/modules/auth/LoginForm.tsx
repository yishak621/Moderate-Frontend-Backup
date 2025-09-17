"use client";

import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextLink from "@/components/ui/Link";

export default function LoginForm() {
  return (
    <div className="bg-[#fdfdfd] p-13.5 rounded-[37px]  w-full max-w-lg mx-auto flex flex-col gap-4 ">
      <div className="flex flex-col items-center pb-8 lg:pb-12 2xl:pb-19.5">
        <h2 className="text-2xl  text-dark font-medium">Moderate</h2>
        <p className="text-gray-600">Teacher Portal System</p>
      </div>

      <div className="   flex flex-col gap-7">
        <Input label="Email" type="email" placeholder="you@example.com" />

        <Input label="Password" type="password" placeholder="*********" />
      </div>
      {/* Placeholder for actual form elements */}
      <div className="sm:mt-7 lg:mt-11 border border-red-400 flex flex-row justify-between">
        <CheckboxWithLabel
          label="Remember me"
          onChange={(val) => console.log("Checked:", val)}
        />

        <TextLink href="/forgot-password" className="font-bold">
          Forgot Password?
        </TextLink>
      </div>

      {/* Button */}
      <Button className="justify-center mt-11 cursor-pointer">Login</Button>
    </div>
  );
}
