import WelcomeBanner from "./WelcomeBanner";
import StatCard from "../StatCard";
import RecentRequests from "./RecentRequests";
import DashboardStats from "./DashboardStats";
import { File, Clock, CheckCircle, BadgeCheck } from "lucide-react";

export default function Content({ onChangeTab }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6">
      <WelcomeBanner onChangeTab={onChangeTab} />

      <DashboardStats />

      <RecentRequests onChangeTab={onChangeTab} />
    </div>
  );
}
