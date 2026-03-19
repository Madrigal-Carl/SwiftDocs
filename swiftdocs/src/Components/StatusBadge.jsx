import { STATUS_COLORS } from "../utils/status_colors";

export default function StatusBadge({ status }) {
  const bgStyles = {
    pending: "bg-yellow-50",
    invoiced: "bg-cyan-50",
    paid: "bg-indigo-50",
    released: "bg-green-50",
    rejected: "bg-red-50",
    active: "bg-green-50",
    inactive: "bg-red-50",
  };

  const textColorMap = {
    pending: STATUS_COLORS.pending,
    invoiced: STATUS_COLORS.invoiced,
    paid: STATUS_COLORS.paid,
    released: STATUS_COLORS.released,
    rejected: STATUS_COLORS.rejected,
    active: STATUS_COLORS.released,
    inactive: STATUS_COLORS.rejected,
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${bgStyles[status]}`}
      style={{ color: textColorMap[status] }}
    >
      {status}
    </span>
  );
}
