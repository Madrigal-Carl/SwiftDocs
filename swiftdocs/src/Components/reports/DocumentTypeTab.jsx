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

export default function DocumentTypeTab() {
  const documentData = [
    { type: "Transcript of Records", count: 25 },
    { type: "Certificate of Enrollment", count: 18 },
    { type: "Diploma", count: 12 },
    { type: "Certificate of Good Moral", count: 15 },
    { type: "Certificate of Registration", count: 9 },
  ];

  return (
    <div className="bg-white border border-(--border-light) rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-(--text-dark) mb-6">
        Requests by Document Type
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={documentData}
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
              width={180}
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
  );
}
