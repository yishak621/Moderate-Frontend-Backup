"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Principal at Lincoln High School",
    content:
      "This platform has completely transformed how our teachers grade and provide feedback. The collaborative features are outstanding!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Mathematics Teacher",
    content:
      "The anonymization feature ensures fair and unbiased grading. It's exactly what we needed for our school.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Curriculum Coordinator",
    content:
      "Tracking student progress across multiple subjects has never been easier. Highly recommended!",
  },
  {
    id: 4,
    name: "David Park",
    role: "Science Department Head",
    content:
      "The intuitive interface makes it easy for both veteran and new teachers to adopt the platform quickly.",
  },
  {
    id: 5,
    name: "Jennifer Martinez",
    role: "English Teacher",
    content:
      "Our grading efficiency has improved by 50% since implementing this platform. It's a game-changer!",
  },
];

export default function TestimonialsSection() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: "trimSnaps" },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <section className="py-20 w-full px-4">
      {/* Top Section */}
      <div className="flex flex-col items-start mb-12">
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
          <p className="text-[#000] text-base font-medium">Testimony</p>
        </div>

        <h3 className="mt-6 text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
          Client Success Spotlight
        </h3>
        <p className="text-[#767676] text-base font-normal leading-normal mb-[36px] max-w-[450px]">
          See how we have transformed businesses like yours
        </p>
      </div>

      {/* Bottom Section - Auto-scrollable Testimonials */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 mr-6">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) {
  return (
    <div className="flex-shrink-0 w-[400px] bg-[#EFEFEF] rounded-[40px] p-8 flex flex-col justify-between items-start self-stretch">
      {/* Top Section - Image */}
      <div className="w-full">
        <div className="w-24 h-24 rounded-full border-2 border-black overflow-hidden sm:mb-[50px] 2xl:mb-[111px]">
          <Image
            src="/images/testimony.png"
            className="w-full h-full object-cover"
            alt={name}
            width={70}
            height={70}
          />
        </div>

        {/* Quote Icon */}
        <div className="mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 36C10.3431 36 9 34.6569 9 33V24C9 22.3431 10.3431 21 12 21H18C19.6569 21 21 22.3431 21 24V33C21 34.6569 19.6569 36 18 36H12ZM30 12C28.3431 12 27 13.3431 27 15V24C27 25.6569 28.3431 27 30 27H36C37.6569 27 39 25.6569 39 24V15C39 13.3431 37.6569 12 36 12H30Z"
              fill="black"
            />
          </svg>
        </div>

        {/* Testimony Content */}
        <p className="text-[#000] text-[26px] font-normal leading-relaxed max-w-[270px] sm:mb-[100px] 2xl:mb-[170px]">
          {content}
        </p>
      </div>

      {/* Bottom Section - Name and Role */}
      <div className="w-full border-l-4 border-black pl-4">
        <p className="text-[#000] text-lg font-medium">{name}</p>
        <p className="text-[#838383] text-sm font-normal">{role}</p>
      </div>
    </div>
  );
}
