"use client";
import SupportPageToggleItem from "@/modules/dashboard/teacher/SupportPageToggleItem";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useState } from "react";

interface SupportClientTeachersProps {
  title: string;
  content: string;
}

const sampleSupportItems: SupportClientTeachersProps[] = [
  {
    title: "How do I create moderate post in my curricular area?",
    content: `- Navigate to my posts section
- Click on the "New Post" button
- You can upload multiple files at once (PDF, images)
- Select curricular area for the moderate post to be displayed in
- Track status and remove files if needed`,
  },
  {
    title: "How can I grade exams using the AI Grading feature?",
    content: `- Open the exam or assignment
- Click on "AI Grade"
- Review AI-generated scores and feedback
- Adjust grades if necessary
- Export results or sync with your gradebook`,
  },
  {
    title: "How do I use rubrics or weighted rubrics for grading?",
    content: `- Go to the grading template section
- Select a rubric or weighted rubric
- Assign points to each criterion
- System calculates the total automatically
- Edit weights or criteria for future assignments`,
  },
  {
    title: "How can I share assignments with students or departments?",
    content: `- Click "Create Assignment"
- Upload your exam or material
- Select target audience (All, specific domains, or classes)
- Set availability dates
- Share via notifications or downloadable links`,
  },
  {
    title: "How do I track submission and grading status?",
    content: `- Navigate to "Dashboard" or "Submissions"
- Filter by assignment, class, or student
- View submission status, grading progress, and feedback
- Export reports for analysis or records`,
  },
  {
    title: "How do I collaborate with other teachers?",
    content: `- Open the assignment or exam
- Click on "Share for Review"
- Select specific teachers or departments
- Comment and provide moderation feedback
- Resolve feedback and finalize grading collaboratively`,
  },
  {
    title: "How do I handle student inquiries or re-evaluation requests?",
    content: `- Students submit queries via the platform
- Open "Queries" or "Re-evaluation"
- Review submission and supporting files
- Update grades or provide comments
- Notify the student once resolved`,
  },
  {
    title: "How can I export grades or reports?",
    content: `- Go to "Reports"
- Select the exam, class, or grading period
- Choose format (PDF, Excel, CSV)
- Download or send via email directly`,
  },
  {
    title: "How do I manage my profile and notifications?",
    content: `- Click on your avatar/profile
- Update personal info, email, or password
- Configure notification preferences
- Enable or disable email alerts`,
  },
  {
    title: "How do I request new school domains or emails to be registered?",
    content: `- Click the "Request Access" link if your email is missing
- Fill out school and domain details
- Submit the request
- Access domain-specific content once approved`,
  },
];

export default function SupportContent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-[40px] rounded-xl sm:rounded-2xl md:rounded-[40px] py-4 px-4 md:py-6 md:px-7 bg-[#FDFDFD] min-h-screen">
      {/* left side */}
      <div className="flex flex-col">
        <h4 className="text-[#0C0C0C] text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 md:mb-[40px]">
          Help Center
        </h4>
        <div className="flex flex-col gap-3 sm:gap-4">
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
        <div className="mt-3 sm:mt-4">
          {/* Mobile: single black button */}
          <div className="md:hidden">
            <Link href={"/dashboard/teacher/support/support_messages"}>
              <Button
                variant="black"
                className="w-full h-11 px-5 py-2.5 text-sm"
              >
                Contact Customer Support
              </Button>
            </Link>
          </div>

          {/* Desktop: two links spaced left/right */}
          <div className="hidden md:flex items-center justify-between">
            <Link
              href={"/dashboard/teacher/guide"}
              className="text-[#368FFF] text-base font-normal cursor-pointer"
            >
              Learn More
            </Link>
            <Link
              href={"/dashboard/teacher/support/support_messages"}
              className="text-[#368FFF] text-base font-normal cursor-pointer"
            >
              Contact Customer Support
            </Link>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="hidden md:flex flex-col">
        <div className="flex flex-col">
          <h4 className="text-[#0C0C0C] text-lg sm:text-xl font-medium mb-[40px]">
            Live Chat (Demo)
          </h4>
          <div className="border border-[#DBDBDB] rounded-[21px] min-h-[60vh] md:min-h-screen"></div>
        </div>
      </div>
    </div>
  );
}
