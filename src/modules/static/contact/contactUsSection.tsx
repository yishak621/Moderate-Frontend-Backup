"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export default function ContactUsSection() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to: "contact@moderatetech.co.uk",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowSuccess(true);
        setFormData({ name: "", email: "", message: "" });

        // Hide success after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 w-full">
      <div className="flex flex-row justify-between items-start gap-8">
        {/* Left Side - Title & Description */}
        <div className="flex-1 flex flex-col items-start gap-6">
          {/* Badge */}
          <div className="flex flex-row items-center bg-[#f3f3f3] rounded-[41.5px] gap-2.5 py-3.5 px-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <circle cx="5" cy="5" r="5" fill="#2997F1" />
            </svg>
            <p className="text-[#000] text-base font-medium">Contact</p>
          </div>

          {/* Title */}
          <h2 className="text-[32px] text-[#000] font-sf-pro-display font-medium leading-normal max-w-[500px]">
            We are always ready to help you and answer your questions
          </h2>
        </div>

        {/* Right Side - Contact Form */}
        <div className="flex-1 bg-[#FBFBFB] rounded-[20px] p-8 relative flex flex-col">
          {/* Success Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[20px] flex items-center justify-center z-10 animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-600 text-xl font-semibold">✓ Sent!</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />

            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
             cursor-pointer   bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5
                rounded-full text-base font-medium transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40
                transform hover:-translate-y-0.5 active:scale-100
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-blue-600
              "
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {/* Error Status */}
            {submitStatus === "error" && (
              <p className="text-red-600 text-sm mt-2">
                Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
