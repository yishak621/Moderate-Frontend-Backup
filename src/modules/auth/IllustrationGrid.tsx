const steps = [
  {
    title: "Domain Check",
    image: "/images/illustration/email-domain-reg-step1.png",
    alt: "Domain verification illustration",
  },
  {
    title: "Verification Sent",
    image: "/images/illustration/email-domain-reg-step2.png",
    alt: "Email sent illustration",
  },
  {
    title: "Pending Approval",
    image: "/images/illustration/email-domain-reg-step3.png",
    alt: "Pending approval illustration",
  },
  {
    title: "Account Activated",
    image: "/images/illustration/email-domain-reg-step4.png",
    alt: "Account activated illustration",
  },
];

export default function IllustrationGrid() {
  return (
    <div className="flex flex-col items-center justify-center  p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Verification Process
      </h2>
      <div className="grid grid-cols-2 gap-8 max-w-2xl">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Step Number Badge */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-4">
              {index + 1}
            </div>

            {/* Illustration Image */}
            <div className=" rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <img
                src={step.image}
                alt={step.alt}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Step Title */}
            <h3 className="text-sm font-semibold text-gray-700 text-center">
              {step.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
