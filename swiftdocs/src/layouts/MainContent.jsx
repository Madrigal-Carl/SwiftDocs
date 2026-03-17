import Content from "../components/dashboard/Content";

export default function MainContent({ selectedTab, onChangeTab }) {
  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return <Content onChangeTab={onChangeTab} />;

      case "Document Requests":
        return <div>📄 Document Requests Content</div>;

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
