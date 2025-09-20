"use client";
import makeAnimated from "react-select/animated";

import CheckboxWithLabel from "@/components/CheckboxWithLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextLink from "@/components/ui/Link";
import Link from "next/link";
import { CustomMultiSelect } from "@/components/ui/MultiSelectInput";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
export default function RegisterForm() {
  const handleSelected = (values: { value: string; label: string }[]) => {
    console.log("Selected values:", values);
    // you can use these in real-time (e.g. store in state, send to API, etc.)
  };
  return (
    <div className="bg-[#fdfdfd] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 2xl:px-12 2xl:py-14 rounded-[24px] w-full max-w-lg mx-auto  flex flex-col gap-6 max-h-screen overflow-scroll scrollbar-hide">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pb-2 sm:pb-2 lg:pb-4 ">
        <h2 className="text-2xl font-semibold text-dark">Moderate</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Teacher Portal System
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="*********" />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="*********"
        />
        <div>
          <p className="text-[#0c0c0c] text-base font-normal mb-1">
            Subject Domains
          </p>
          <CustomMultiSelect
            options={options}
            defaultValue={[options[0], options[1]]}
            onChange={handleSelected}
          />
        </div>
      </div>

      {/* Button */}
      <Button className="justify-center mt-2.5 sm:mt-4 text-base cursor-pointer w-full">
        Signup
      </Button>

      <div className="text-center text-sm sm:text-base mt-1">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
