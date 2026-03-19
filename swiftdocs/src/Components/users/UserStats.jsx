import CountCard from "../CountCard";
import { UsersRound, UserCheck, UserCog, PhilippinePeso } from "lucide-react";

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <CountCard
        title="Total Users"
        value="12"
        icon={UsersRound}
        colorClass="purple"
      />
      <CountCard
        title="Active Users"
        value="10"
        icon={UserCheck}
        colorClass="blue"
      />
      <CountCard title="RMO Staff" value="5" icon={UserCog} colorClass="cyan" />
      <CountCard
        title="Cashier Staff"
        value="5"
        icon={PhilippinePeso}
        colorClass="yellow"
      />
    </div>
  );
}
