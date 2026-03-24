import DashboardContent from "../pages/dashboard/Content";
import RequestsContent from "../pages/requests/Content";
import ReportsContent from "../pages/reports/Content";
import UsersContent from "../pages/users/Content";
import ProfileContent from "../pages/profile/Content";
import DocumentContent from "../pages/document/Content";
import ProcessContent from "../pages/process/Content";
import PaymentContent from "../pages/payment/Content";
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
        return (
          <PageLayout title="Payment Verification">
            <PaymentContent />
          </PageLayout>
        );

      case "Document Processing":
        return (
          <PageLayout title="Document Processing">
            <ProcessContent />
          </PageLayout>
        );

      case "Reports":
        return (
          <PageLayout title="Reports & Analytics">
            <ReportsContent />
          </PageLayout>
        );

      case "Document":
        return (
          <PageLayout title="Document Management">
            <DocumentContent />
          </PageLayout>
        );

      case "User Management":
        return (
          <PageLayout title="User Management">
            <UsersContent />
          </PageLayout>
        );

      case "Profile":
        return (
          <PageLayout title="Profile Settings">
            <ProfileContent />
          </PageLayout>
        );
    }
  };

  return <div>{renderContent()}</div>;
}
