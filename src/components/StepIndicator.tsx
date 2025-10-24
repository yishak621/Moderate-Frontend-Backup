type StepIndicatorProps = {
  steps: Array<{
    title: string;
    desc: string;
  }>;
  current: number;
};

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Current Step Content */}
      <div className="text-center mb-8">
        <h3 className="font-semibold text-lg text-blue-600 mb-2">
          {steps[current]?.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          {steps[current]?.desc}
        </p>
      </div>

      {/* Progress Line with Circles */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index < current
                    ? "bg-green-500 border-green-500 text-white"
                    : index === current
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {index < current ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-20 h-1 mx-3 transition-colors duration-300 ${
                    index < current ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
