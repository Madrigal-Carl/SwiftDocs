import {
  FileText,
  CreditCard,
  FileCheck,
  BadgeCheck,
  Check,
  XCircle,
} from "lucide-react";

export default function ProgressTracker({ status }) {
  const steps = [
    { id: 1, label: "Under Review", icon: FileText },
    { id: 2, label: "Payment Pending", icon: CreditCard },
    { id: 3, label: "Processing", icon: FileCheck },
    { id: 4, label: "Completed", icon: BadgeCheck },
  ];

  const completedColors = [
    "bg-yellow-500 text-white",
    "bg-cyan-500 text-white",
    "bg-indigo-500 text-white",
    "bg-green-500 text-white",
  ];

  const currentBorderColor =
    "border-(--primary-600) text-(--primary-600) ring-4 ring-(--primary-100)";

  const isRejected = status.toLowerCase() === "rejected";
  const isReleased = status.toLowerCase() === "released";

  let currentStep = 1;
  if (!isRejected && !isReleased) {
    switch (status.toLowerCase()) {
      case "pending":
        currentStep = 1;
        break;
      case "invoiced":
        currentStep = 2;
        break;
      case "paid":
        currentStep = 3;
        break;
      default:
        currentStep = 1;
    }
  }

  return (
    <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm flex flex-col justify-center items-center gap-4">
      <h1 className="text-lg font-medium text-(--text-dark)">
        Request Progress
      </h1>

      {/* LEFT ALIGNED WRAPPER */}
      <div className="w-1/2">
        <div
          className={`flex items-center relative ${
            isRejected ? "justify-start" : "justify-center"
          }`}
        >
          {/* Base connecting line (dynamic length) */}
          <div
            className={`absolute top-5 left-1/2 -translate-x-1/2 h-0.5 bg-gray-200 ${
              isRejected ? "w-full" : "w-[80%]"
            }`}
          ></div>

          {/* Normal 4 steps */}
          {steps.map((step, index) => {
            const isCompleted =
              isReleased ||
              (!isReleased && currentStep > step.id && !isRejected);
            const isCurrent =
              !isReleased && currentStep === step.id && !isRejected;

            const StepIcon = isCompleted ? Check : step.icon;

            const stepClass = isCompleted
              ? completedColors[index]
              : isCurrent
                ? `bg-white ${currentBorderColor} border-2 scale-110`
                : "bg-white text-gray-400 border-2 border-gray-200";

            const stepTextColor =
              isCompleted || isCurrent ? "text-(--text-dark)" : "text-gray-400";

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: "20%" }} // still 5 slots reserved
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${stepClass}`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-xs font-medium ${stepTextColor}`}>
                  {step.label}
                </span>
              </div>
            );
          })}

          {/* Rejected step */}
          {isRejected && (
            <div
              className="flex flex-col items-center relative z-10"
              style={{ width: "20%" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="mt-2 text-xs font-medium text-red-500">
                Rejected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
