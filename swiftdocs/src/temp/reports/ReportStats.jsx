import StatCard from "../StatCard";
import { File, Clock, CheckCircle, PhilippinePeso } from "lucide-react";
import { useRequestStore } from "../../stores/request_store";

export default function ReportStats() {
  const { stats } = useRequestStore();

  const totalRequests = stats?.totalRequests || 0;
  const totalTrend = stats?.monthlyTrend?.all || { value: "0%", trendUp: true };

  const revenue = stats?.revenue || {
    total: 0,
    trend: { value: "0%", trendUp: true },
  };

  const avgProcessing = stats?.avgProcessingTime || {
    value: "0 days",
    trend: { value: "0%", trendUp: true },
  };

  const completion = stats?.completionRate || {
    value: "0%",
    trend: { value: "0%", trendUp: true },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Requests"
        value={totalRequests}
        trend={totalTrend.value}
        trendUp={totalTrend.trendUp}
        icon={File}
        status="blue"
      />

      <StatCard
        title="Total Revenue"
        value={`₱${revenue.total.toLocaleString()}`}
        trend={revenue.trend.value}
        trendUp={revenue.trend.trendUp}
        icon={PhilippinePeso}
        status="green"
      />

      <StatCard
        title="Avg Processing Time"
        value={avgProcessing.value}
        trend={avgProcessing.trend.value}
        trendUp={avgProcessing.trend.trendUp}
        icon={Clock}
        status="yellow"
      />

      <StatCard
        title="Completion Rate"
        value={completion.value}
        trend={completion.trend.value}
        trendUp={completion.trend.trendUp}
        icon={CheckCircle}
        status="green"
      />
    </div>
  );
}
