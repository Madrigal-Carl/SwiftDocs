import DashboardContent from "../pages/dashboard/Content";
import RequestsContent from "../pages/requests/Content";
import ReportsContent from "../pages/reports/Content";
import UsersContent from "../pages/users/Content";
import PageLayout from "./PageLayout";

export default function MainContent({ selectedTab, onChangeTab }) {
  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return (
          <PageLayout title="Dashboard">
            <DashboardContent onChangeTab={onChangeTab} />
          </PageLayout>
        );

      case "Document Requests":
        return (
          <PageLayout title="Document Requests">
            <RequestsContent />
          </PageLayout>
        );

      case "Payment Verification":
        return <div>💳 Payment Verification Content</div>;

      case "Document Processing":
        return <div>⚙️ Document Processing Content</div>;

      case "Reports":
        return (
          <PageLayout title="Reports & Analytics">
            <ReportsContent />
          </PageLayout>
        );

      case "User Management":
        return (
          <PageLayout title="User Management">
            <UsersContent />
          </PageLayout>
        );

      case "Settings":
        return <div>⚙️ Settings Content</div>;

      default:
        return <div>Welcome</div>;
    }
  };

  return <div>{renderContent()}</div>;
}
