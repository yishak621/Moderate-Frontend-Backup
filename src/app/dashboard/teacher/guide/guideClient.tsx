"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StatusCircle from "@/modules/dashboard/teacher/StatusCircle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GuideItem {
  id: number;
  title: string;
  videoUrl?: string;
  description: string;
  links?: { label: string; href: string }[];
}

const guideItems: GuideItem[] = [
  {
    id: 1,
    title: "How to Upload Documents",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Steps to upload documents:**
Upload exam papers, tests, research papers, or scanned files.  
You can upload multiple files at once (**PDF, image, DOCX**).  
Ensure each file is labeled with student info for accurate grading.  
Attach files to specific moderation posts for review.
    `,
    links: [{ label: "View Upload Guide", href: "#" }],
  },
  {
    id: 2,
    title: "Using the Grading System",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Grading workflow:**
Use **rubrics**, **weighted rubrics**,**Letter**,**Pass or Fail**,**Checklist** or **numeric criteria**.  
Teachers can comment and track performance collaboratively.  
Adjust points, criteria, and review scores efficiently.  
Maintain grading consistency across all submissions.
    `,
    links: [
      { label: "Grading Docs", href: "#" },
      { label: "Best Practices", href: "#" },
    ],
  },
  {
    id: 3,
    title: "Collaborating with Other Teachers",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Collaboration tips:**
Communicate with teachers in your curricular domain.  
Discuss grading, share insights, and leave feedback.  
Use the built-in **messenger** for real-time communication.  
Ensure consistent academic standards across moderation posts.
    `,
  },
  {
    id: 4,
    title: "Trial and Subscription",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Moderate plans:**
1-month **free trial** for new users.  
Subscribe after trial to continue using the platform.  
Manage billing, upgrade your plan, and check subscription status.
    `,
  },
  {
    id: 5,
    title: "Mobile Application Access",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Mobile usage:**
Upload files, grade exams, and communicate on the go.  
Access the platform from **phones or tablets**.  
Stay productive while away from desktop environments.
    `,
  },
  {
    id: 6,
    title: "Creating a Moderation Post",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Posting exams/tests:**
Attach multiple scanned files.  
Define **grading criteria** for collaborators.  
Include instructions and deadlines for grading feedback.
    `,
  },
  {
    id: 7,
    title: "Managing Uploaded Files",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**File management:**
View, remove, or reorganize uploaded documents.  
Ensure all files are correctly labeled and accessible.  
Streamline grading workflows for each moderation post.
    `,
  },
  {
    id: 8,
    title: "Tracking Grading Progress",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Progress tracking:**
Monitor the status of moderation posts.  
See which exams have been graded and pending tasks.  
Track comments from collaborators and generate summary reports.
    `,
  },
  {
    id: 9,
    title: "Security and Permissions",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Access control:**
Domain-based access ensures only authorized teachers can view posts.  
Manage roles and permissions safely for collaboration.  
Keep grading data **secure and confidential**.
    `,
  },
  {
    id: 10,
    title: "Support and Help Center",
    videoUrl: "https://www.youtube.com/embed/C14PrxJ326A?si=IyBIhitg7kHdQ1vM",
    description: `
**Need help?**
Access FAQs, video tutorials, and documentation.  
Learn how to upload, grade, and collaborate efficiently.  
Make the most out of the **Moderate** platform.
    `,
  },
];

export default function GuideClient() {
  const [selected, setSelected] = useState<GuideItem | null>(guideItems[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-2">
      {/* Left sidebar */}
      <div className="bg-[#FDFDFD] flex flex-col rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-sm p-6 shadow-sm min-h-screen">
        <Link
          href={"/dashboard/teacher/support"}
          className="text-[#0C0C0C] text-xl font-medium flex flex-row items-center gap-2.5 mb-8 hover:text-[#368FFF] transition"
        >
          <ArrowLeft size={21} /> Learn More
        </Link>

        <div className="flex flex-col gap-4">
          {guideItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={` flex flex-row items-center text-left gap-2 font-normal px-4 py-3 rounded-xl transition-all cursor-pointer ${
                selected?.id === item.id
                  ? "bg-[#368FFF] text-white"
                  : "hover:bg-[#EDEDED] text-[#717171]"
              }`}
            >
              <StatusCircle
                color={selected?.id === item.id ? "bg-white" : "bg-transparent"}
              />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="bg-[#FDFDFD] rounded-tl-sm rounded-bl-sm rounded-tr-2xl rounded-br-2xl p-6 shadow-sm">
        {selected ? (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-[#0C0C0C]">
              {selected.title}
            </h2>

            {selected.videoUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow">
                <iframe
                  src={selected.videoUrl}
                  title={selected.title}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="prose prose-sm text-[#717171]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.description}
              </ReactMarkdown>
            </div>

            {selected.links && (
              <div className="flex flex-wrap gap-3">
                {selected.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-[#368FFF] border border-[#368FFF] rounded-full hover:bg-[#368FFF] hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-[#717171] text-base">Select an item to view</p>
        )}
      </div>
    </div>
  );
}
