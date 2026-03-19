import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import RecentRequests from "../../components/dashboard/RecentRequests";
import DashboardStats from "../../components/dashboard/DashboardStats";

export default function Content({ onChangeTab }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <WelcomeBanner onChangeTab={onChangeTab} />

      <DashboardStats />

      <RecentRequests onChangeTab={onChangeTab} />
    </div>
  );
}
