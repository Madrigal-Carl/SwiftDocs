import { useEffect } from "react";
import CountCard from "../CountCard";
import { UsersRound, UserCheck, UserCog, PhilippinePeso } from "lucide-react";
import { useAccountStore } from "../../stores/account_store";

export default function UserStats() {
  const { stats, loadAnalytics } = useAccountStore();

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CountCard
        title="Total Users"
        value={stats.totalUser}
        icon={UsersRound}
        colorClass="purple"
      />
      <CountCard
        title="Active Users"
        value={stats.activeUser}
        icon={UserCheck}
        colorClass="blue"
      />
      <CountCard
        title="RMO Staff"
        value={stats.rmoCount}
        icon={UserCog}
        colorClass="cyan"
      />
      <CountCard
        title="Cashier Staff"
        value={stats.cashierCount}
        icon={PhilippinePeso}
        colorClass="yellow"
      />
    </div>
  );
}
