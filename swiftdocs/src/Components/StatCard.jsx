import { STATUS_COLORS } from "../utils/status_colors";

export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  status,
}) {
  const colorClasses = {
    pending: "bg-yellow-50",
    invoiced: "bg-cyan-50",
    paid: "bg-indigo-50",
    released: "bg-green-50",
    rejected: "bg-red-50",
  };

  return (
    <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-(--text-dark)">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}
            >
              {trendUp ? "+" : ""}
              {trend}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[status] || colorClasses.default}`}
          style={{ color: STATUS_COLORS[status] }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
