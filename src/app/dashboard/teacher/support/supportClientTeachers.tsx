"use client";
import SupportPageToggleItem from "@/modules/dashboard/teacher/SupportPageToggleItem";
import { useState } from "react";

interface SupportClientTeachersProps {
  title: string;
  content: string;
}
const sampleSupportItems: SupportClientTeachersProps[] = [
  {
    title: "How do I upload a PDF?",
    content:
      "Go to Uploads and drag the file into the dropzone. Accepted types include PDF, DOCX, PNG, JPG.",
  },
  {
    title: "Can I edit documents after uploading?",
    content:
      "Yes, you can edit supported formats directly in the editor. PDF annotations are also possible.",
  },
  {
    title: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' at login. You’ll receive a reset link by email.",
  },
  {
    title: "Is there a storage limit?",
    content:
      "Each account comes with 5GB free storage. You can upgrade anytime for more space.",
  },
];

export default function SupportClientTeachers() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] rounded-[40px] py-6 px-7 bg-[#FDFDFD] min-h-screen">
      {/* left side */}
      <div className="flex flex-col">
        <h4 className="text-[#0C0C0C] text-xl font-medium mb-[40px]">
          Help Center
        </h4>
        <div className="flex flex-col gap-4">
          {sampleSupportItems.map((item, idx) => (
            <SupportPageToggleItem
              key={idx}
              title={item.title}
              content={item.content}
              isOpen={activeIndex === idx}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            />
          ))}
        </div>
        <p className="mt-auto text-[#368FFF] text-base font-normal cursor-pointer">
          Learn More
        </p>
      </div>

      {/* right side */}
      <div className="  flex flex-col ">
        <div className="flex flex-col">
          <h4 className="text-[#0C0C0C] text-xl font-medium mb-[40px]">
            Live Chat (Demo)
          </h4>
          <div className=" border border-[#DBDBDB] rounded-[21px] min-h-screen"></div>
        </div>
      </div>
    </div>
  );
}
