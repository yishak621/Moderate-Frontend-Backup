"use client";

import { ArrowDownRight } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What is grade moderation?",
    answer:
      "Grade moderation is a collaborative process where educators review, discuss, and standardize assessment scores to ensure fairness and consistency across different teachers and schools.",
  },
  {
    id: 2,
    question: "How does the anonymization feature work?",
    answer:
      "Our platform automatically blurs or removes student names from submitted work before grading, ensuring unbiased assessment and preventing any personal bias.",
  },
  {
    id: 3,
    question: "Can I track grading history?",
    answer:
      "Yes! Our platform provides comprehensive tracking of all grading activities, including audit trails, history logs, and detailed insights for both individual assessments and overall performance.",
  },
  {
    id: 4,
    question: "Is this platform suitable for large school districts?",
    answer:
      "Absolutely! Our platform is designed to scale from individual teachers to entire districts, with support for multiple schools, hundreds of teachers, and thousands of students.",
  },
  {
    id: 5,
    question: "How secure is the student data?",
    answer:
      "Security is our top priority. We use end-to-end encryption, comply with educational data privacy regulations, and implement strict access controls to protect all student information.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(faqs[0].id);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 w-full px-2">
      <div className="flex flex-col items-center mb-12 sm:mb-16 md:mb-20 lg:mb-[70px] xl:mb-[100px]">
        <div className="flex flex-row items-center bg-[#f3f3f3] rounded-[41.5px] gap-2.5 py-2.5 px-4 sm:py-3.5 sm:px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#2997F1" />
          </svg>
          <p className="text-[#000] text-sm sm:text-base font-medium">FAQ</p>
        </div>
        <h3 className="mt-4 sm:mt-6 text-[24px] sm:text-[28px] md:text-[32px] text-[#000] font-medium leading-normal px-4 text-center">
          Frequently Asked Questions
        </h3>
      </div>

      {/* FAQ Items */}
      <div className="flex flex-col items-start gap-3 sm:gap-4 max-w-3xl mx-auto w-full">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="w-full bg-[#F7F7F7] rounded-[16px] sm:rounded-[20px] overflow-hidden transition-all duration-300 ease-in-out"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between py-6 px-4 sm:py-8 sm:px-6 md:py-[37px] md:px-[49px] text-left transition-colors duration-200 hover:bg-[#EFEFEF]"
            >
              <p className="text-[#000] text-sm sm:text-base md:text-lg font-medium pr-4 sm:pr-8">
                {faq.question}
              </p>
              <div
                className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M8.12911 13.2991L19.0412 1.86049M19.0412 1.86049L19.3045 13.0358M19.0412 1.86049L7.86581 2.1238"
                    stroke="black"
                    stroke-width="1.375"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Answer Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 sm:px-6 md:px-[49px] pb-4 sm:pb-6 text-[#838383] text-sm sm:text-base font-normal leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
