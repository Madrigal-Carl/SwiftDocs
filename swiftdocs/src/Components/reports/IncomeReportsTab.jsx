import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useRequestStore } from "../../stores/request_store";

export default function IncomeReportsTab() {
  const { stats } = useRequestStore();

  const revenueData = stats?.monthlyRevenue || [];

  return (
    <div className="bg-white border border-(--border-light) rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-(--text-dark) mb-6">
        Monthly Revenue
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => `₱${value}`}
            />
            <Tooltip content={<CustomTooltip valuePrefix="₱" />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary-500)"
              strokeWidth={3}
              dot={{ fill: "var(--primary-500)", r: 4 }}
              activeDot={{ r: 6, fill: "var(--primary-500)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
