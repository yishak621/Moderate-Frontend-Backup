import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 w-full px-4 bg-blue-600">
      <h3 className="mt-6 text-[32px] text-[#000] font-medium leading-normal max-w-[356px]">
        Upload once, discuss together
      </h3>
      <p className="text-[#666] text-base font-medium leading-normal mb-[36px] max-w-[450px]">
        Docs or scans—names excluded by design. Grade with your own rubric and
        comment in one place.
      </p>

      <Link
        href="/auth/register"
        className="
               text-center
              bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5
              rounded-full text-base font-medium transition-colors
            "
      >
        Create your first moderate post
      </Link>
    </section>
  );
}
