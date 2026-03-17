import StatCard from "../StatCard";
import { ROLE_STATS } from "../../utils/stats_config";
import { countByStatus } from "../../utils/request_stats";
import { useAuth } from "../../stores/auth/auth_store";
import { useRequestStore } from "../../stores/request/request_store";
import { getMonthlyTrend } from "../../utils/request_trend";
import { File } from "lucide-react";

export default function DashboardStats() {
  const { user } = useAuth();
  const { requests } = useRequestStore();

  const statsConfig = ROLE_STATS[user.role] || [];

  const totalRequests = requests.filter((item) => item.request).length;

  const totalTrend = getMonthlyTrend(requests);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Requests"
        value={totalRequests}
        trend={totalTrend.value}
        trendUp={totalTrend.trendUp}
        icon={File}
        status="default"
      />

      {statsConfig.map((stat, index) => {
        const value = countByStatus(requests, stat.status);

        const trendData = getMonthlyTrend(requests, stat.status);

        return (
          <StatCard
            key={index}
            title={stat.title}
            value={value}
            trend={trendData.value}
            trendUp={trendData.trendUp}
            icon={stat.icon}
            status={stat.status}
          />
        );
      })}
    </div>
  );
}
