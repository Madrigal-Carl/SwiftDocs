import Header from "./Header";
import DashboardContent from "../pages/dashboard/Content";
import RequestsContent from "../pages/requests/Content";

export default function MainContent({ selectedTab, onChangeTab }) {
  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return (
          <div className="flex-1 flex flex-col ml-64 overflow-hidden">
            <Header name="Dashboard" />

            <DashboardContent onChangeTab={onChangeTab} />
          </div>
        );

      case "Document Requests":
        return (
          <div className="flex-1 flex flex-col ml-64 overflow-hidden">
            <Header name="Document Requests" />

            <RequestsContent onChangeTab={onChangeTab} />
          </div>
        );

      case "Payment Verification":
        return <div>💳 Payment Verification Content</div>;

      case "Document Processing":
        return <div>⚙️ Document Processing Content</div>;

      case "Reports":
        return <div>📈 Reports Content</div>;

      case "User Management":
        return <div>👥 User Management Content</div>;

      case "Settings":
        return <div>⚙️ Settings Content</div>;

      default:
        return <div>Welcome</div>;
    }
  };

  return <div>{renderContent()}</div>;
}
