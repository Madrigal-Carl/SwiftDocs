import {
  FileText,
  CreditCard,
  BadgeCheck,
  Check,
  XCircle,
  Clock,
} from "lucide-react";
import { STATUS_COLORS } from "../../utils/status_colors";

export default function ProgressTracker({ status, completedDate, logs = [] }) {
  const normalize = (s) => s?.toLowerCase();

  const getTransitionDate = (to) => {
    const filtered = logs
      .filter((l) => l.to_status === to)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const log = filtered[0];
    return log ? log.createdAt.split("T")[0] : null;
  };

  const currentStatus = normalize(status);

  const isRejected = currentStatus === "rejected";
  const isReleased = currentStatus === "released";

  // ✅ MAIN FLOW ONLY
  const order = ["pending", "invoiced", "paid", "released"];

  const currentIndex = order.indexOf(currentStatus);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const dates = {
    pending: safeIndex >= 0 ? getTransitionDate("pending") : null,
    invoiced: safeIndex >= 1 ? getTransitionDate("invoiced") : null,
    paid: safeIndex >= 2 ? getTransitionDate("paid") : null,
    released:
      safeIndex >= 3 ? completedDate || getTransitionDate("released") : null,
  };

  const steps = [
    {
      id: 0,
      key: "pending",
      label: "Pending",
      icon: FileText,
      date: dates.pending,
    },
    {
      id: 1,
      key: "invoiced",
      label: "Payment Pending",
      icon: CreditCard,
      date: dates.invoiced,
    },
    {
      id: 2,
      key: "paid",
      label: "Processing",
      icon: Clock,
      date: dates.paid,
    },
    {
      id: 3,
      key: "released",
      label: "Released",
      icon: BadgeCheck,
      date: dates.released,
    },
  ];

  const getStepState = (step) => {
    if (isRejected) return "stale";

    const currentIndexRaw = order.indexOf(currentStatus);
    const currentIndex = currentIndexRaw === -1 ? 0 : currentIndexRaw;
    const stepIndex = order.indexOf(step.key);

    if (isReleased) return "completed";

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "stale";
  };

  const getStepClass = (state) => {
    if (state === "completed") return `text-white`;

    if (state === "current") {
      return `bg-white border-2 scale-110`;
    }

    return "bg-white text-gray-400 border-2 border-gray-200";
  };

  const getStepStyle = (state, step) => {
    const color =
      step.key === "released"
        ? STATUS_COLORS["released"]
        : STATUS_COLORS[step.key];

    if (state === "completed") {
      return { backgroundColor: color };
    }

    if (state === "current") {
      return {
        borderColor: color,
        color: color,
        boxShadow: `0 0 0 4px ${color}20`,
      };
    }

    return {};
  };

  const getTextColor = (state) => {
    return state === "stale" ? "text-gray-400" : "text-(--text-dark)";
  };

  return (
    <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm flex flex-col justify-center items-center gap-4">
      <h1 className="text-lg font-medium text-(--text-dark)">
        Request Progress
      </h1>

      <div className="w-1/2">
        <div className="flex items-center relative justify-center">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 h-0.5 bg-gray-200 w-[80%]" />

          {steps.map((step) => {
            const state = getStepState(step);
            const StepIcon = state === "completed" ? Check : step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: "20%" }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${getStepClass(
                    state,
                  )}`}
                  style={getStepStyle(state, step)}
                >
                  <StepIcon className="w-5 h-5" />
                </div>

                <span
                  className={`mt-2 text-xs font-medium ${getTextColor(state)}`}
                >
                  {step.label}
                </span>

                {step.date && (
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {step.date}
                  </span>
                )}
              </div>
            );
          })}

          {/* ✅ REJECTED NODE (kept separate like your original design) */}
          {isRejected && (
            <div
              className="flex flex-col items-center relative z-10"
              style={{ width: "20%" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{
                  backgroundColor: STATUS_COLORS["rejected"],
                }}
              >
                <XCircle className="w-5 h-5" />
              </div>

              <span
                className="mt-2 text-xs font-medium capitalize"
                style={{ color: STATUS_COLORS["rejected"] }}
              >
                rejected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
