import { STATUS_COLORS } from "../utils/status_colors";

export default function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50",
    invoiced: "bg-cyan-50",
    paid: "bg-indigo-50",
    released: "bg-green-50",
    rejected: "bg-red-50",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${styles[status]}`}
      style={{ color: STATUS_COLORS[status] }}
    >
      {status}
    </span>
  );
}
