import Link from "next/link";

const benefits = [
  {
    title: "Digital Test Management",
    description: [
      "Teachers can upload exam papers (images or PDFs).",
      "Students’ tests are organized digitally for easy access.",
    ],
  },
  {
    title: "Collaborative Grading",
    description: [
      "Collaborative grading within departments",
      "Comments and feedback are centralized.",
    ],
  },
];

const benefitsRight = [
  {
    title: "Teacher–Student Engagement",
    description: [
      "Test posts feel like a social feed, encouraging interaction.",
      "Upload, comment, and get feedback instantly.",
    ],
  },
  {
    title: "Performance Tracking",
    description: [
      "Track grades and progress over time.",
      "Provides insights for teachers and administrators.",
    ],
  },
  {
    title: "Centralized Record Keeping",
    description: ["All graded tests and comments are stored securely."],
  },
];
export default function BenefitsSection() {
  return (
    <section className="py-20 w-full px-4 ">
      <div className="flex flex-col ">
        {/* Left side  */}
        <div className="flex flex-col">
          <h3 className="mb-[94px] text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
            Benefits for Schools — Why Partner With Us
          </h3>
          <div className="flex flex-row justify-between">
            {/* card wrapper */}
            <div className="bg-[#f6f6f6] px-2 py-2 pb-[73px] rounded-[59px] max-w-[688px]">
              <div className="bg-[#fff] py-[81px] px-[62px] flex flex-col items-start rounded-[59px]">
                {benefits.map((benefit) => (
                  <BenefitsItem key={benefit.title} {...benefit} />
                ))}
              </div>
            </div>

            {/* Right side  */}
            <div className="flex flex-col">
              {benefitsRight.map((benefit) => (
                <BenefitsItem key={benefit.title} {...benefit} />
              ))}
              <Link
                href="/auth/register"
                className="
                    w-full text-center
                    bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5
                    rounded-full text-base font-medium transition-colors
                  "
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsItem({
  title,
  description,
}: {
  title: string;
  description: string[];
}) {
  return (
    <div className=" flex flex-col items-start gap-4 mb-10">
      <h4 className="text-[24px] text-[#000] font-medium leading-normal">
        {title}
      </h4>
      <div className=" flex flex-col gap-4">
        {description.map((desc, index) => (
          <div
            key={index}
            className="flex flex-row items-center bg-[#f8f8f8] py-3.5 px-7 rounded-[42px] gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="flex-shrink-0"
            >
              <circle cx="5" cy="5" r="5" fill="#2997F1" />
            </svg>
            <p className="text-[16px] text-[#000] font-medium leading-normal">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
