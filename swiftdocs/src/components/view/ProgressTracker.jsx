import { FileText, CreditCard, BadgeCheck, Check, XCircle } from "lucide-react";
import { STATUS_COLORS } from "../../utils/status_colors";

export default function ProgressTracker({ status, completedDate, logs = [] }) {
  const normalize = (s) => s?.toLowerCase();

  const getTransitionDate = (to, latest = false) => {
    const filtered = logs
      .filter((l) => l.to_status === to)
      .sort((a, b) =>
        latest
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt),
      );

    const log = filtered[0];
    return log ? log.createdAt.split("T")[0] : null;
  };

  const currentStatus = normalize(status);

  const isRejected = currentStatus === "rejected";
  const isDeficient = currentStatus === "deficient";
  const isBalanceDue = currentStatus === "balance_due";
  const isReleased = currentStatus === "released";

  const isSpecialFlow = isRejected || isBalanceDue;

  const order = ["pending", "under_review", "invoiced", "paid", "released"];
  const currentIndex = order.indexOf(currentStatus);
  const safeIndex = currentIndex === -1 ? order.length : currentIndex;

  const dates = {
    pending:
      !isRejected && !isBalanceDue && safeIndex >= 1
        ? getTransitionDate("under_review")
        : null,

    underReview:
      !isRejected && !isBalanceDue && safeIndex >= 2
        ? getTransitionDate("invoiced")
        : null,

    invoiced:
      !isRejected && !isBalanceDue && safeIndex >= 3
        ? getTransitionDate("paid")
        : null,

    paid:
      !isRejected && !isBalanceDue && safeIndex >= 4
        ? completedDate || getTransitionDate("released")
        : null,
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
      key: "under_review",
      label: "Under Review",
      icon: FileText,
      date: dates.underReview,
    },
    {
      id: 2,
      key: "invoiced",
      label: "Payment Pending",
      icon: CreditCard,
      date: dates.invoiced,
    },
    {
      id: 3,
      key: "paid",
      label: "Released",
      icon: BadgeCheck,
      date: dates.paid,
    },
  ];

  const getStepState = (step) => {
    // ✅ BALANCE DUE
    if (isBalanceDue) {
      if (step.key === "pending") return "active";
      return "stale";
    }

    // ✅ DEFICIENT
    if (isDeficient) {
      if (["pending", "under_review"].includes(step.key)) return "active";
      return "stale";
    }

    // ✅ REJECTED
    if (isRejected) return "stale";

    // ✅ NORMAL FLOW
    const currentIndexRaw = order.indexOf(currentStatus);
    const currentIndex =
      currentIndexRaw === -1 ? order.length : currentIndexRaw;
    const stepIndex = order.indexOf(step.key);

    if (isReleased) return "completed";

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "stale";
  };

  const getStepClass = (state, step, index) => {
    if (state === "completed") {
      return `text-white`;
    }

    if (state === "current" || state === "active") {
      return `bg-white border-2 scale-110`;
    }

    return "bg-white text-gray-400 border-2 border-gray-200";
  };

  const getStepStyle = (state, step) => {
    const color =
      step.key === "paid" ? STATUS_COLORS["released"] : STATUS_COLORS[step.key];

    if (state === "completed") {
      return { backgroundColor: color };
    }

    if (state === "current" || state === "active") {
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

          {steps.map((step, index) => {
            const state = getStepState(step);

            const isCompleted = state === "completed";
            const StepIcon = isCompleted ? Check : step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: "20%" }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${getStepClass(
                    state,
                    step,
                    index,
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

          {/* 👉 REJECTED / DEFICIENT / BALANCE DUE NODE */}
          {(isRejected || isDeficient || isBalanceDue) && (
            <div
              className="flex flex-col items-center relative z-10"
              style={{ width: "20%" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{
                  backgroundColor: STATUS_COLORS[currentStatus],
                }}
              >
                <XCircle className="w-5 h-5" />
              </div>

              <span
                className="mt-2 text-xs font-medium capitalize"
                style={{ color: STATUS_COLORS[currentStatus] }}
              >
                {currentStatus.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
