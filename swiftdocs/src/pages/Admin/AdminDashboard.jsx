import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  FileCheck,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
      href: "index.html",
    },
    {
      icon: FileText,
      label: "Document Requests",
      active: false,
      href: "document-requests.html",
    },
    {
      icon: CreditCard,
      label: "Payment Verification",
      active: false,
      href: "payment-verification.html",
    },
    {
      icon: FileCheck,
      label: "Document Processing",
      active: false,
      href: "document-processing.html",
    },
    {
      icon: BarChart3,
      label: "Reports",
      active: false,
      href: "reports.html",
    },
    {
      icon: Users,
      label: "User Management",
      active: false,
      href: "users.html",
    },
    { icon: Settings, label: "Settings", active: false, href: "#" },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4ff] overflow-hidden">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Header />
        {/* Add your main dashboard content here */}
      </div>
    </div>
  );
}
