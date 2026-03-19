import StatCard from "../StatCard";
import { ROLE_STATS } from "../../utils/stats_config";
import { useAuth } from "../../stores/auth_store";
import { useRequestStore } from "../../stores/request_store";
import { File } from "lucide-react";

export default function DashboardStats() {
  const { user } = useAuth();
  const { stats, analyticsLoading } = useRequestStore();

  const statsConfig = ROLE_STATS[user.role] || [];

  const totalRequests = stats?.totalRequests || 0;
  const totalTrend = stats?.monthlyTrend?.all || {
    value: "0%",
    trendUp: true,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Requests"
        value={totalRequests}
        trend={totalTrend.value}
        trendUp={totalTrend.trendUp}
        icon={File}
        status="paid"
        loading={analyticsLoading}
      />

      {statsConfig.map((stat, index) => {
        const value = stats?.countByStatus?.[stat.status] || 0;

        const trendData = stats?.monthlyTrend?.[stat.status] || {
          value: "0%",
          trendUp: true,
        };

        return (
          <StatCard
            key={index}
            title={stat.title}
            value={value}
            trend={trendData.value}
            trendUp={trendData.trendUp}
            icon={stat.icon}
            status={stat.status}
            loading={analyticsLoading}
          />
        );
      })}
    </div>
  );
}
