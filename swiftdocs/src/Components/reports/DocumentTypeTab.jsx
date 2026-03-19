import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useRequestStore } from "../../stores/request_store";

export default function DocumentTypeTab() {
  const { stats } = useRequestStore();

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const documentData = Object.entries(stats?.documentTypeCounts || {}).map(
    ([type, count]) => ({
      type: capitalizeWords(type),
      count,
    }),
  );

  const sortedData = [...documentData].sort((a, b) => b.count - a.count);

  const chartHeight = sortedData.length * 40;

  return (
    <div className="bg-white border border-(--border-light) rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-(--text-dark) mb-6">
        Requests by Document Type
      </h3>

      <div className="h-82 overflow-y-auto pr-2">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                horizontal={true}
                vertical={false}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                dataKey="type"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={220}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="count"
                fill="var(--primary-600)"
                radius={[0, 6, 6, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
