import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
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
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FileText, label: "Document Requests" },
    { icon: CreditCard, label: "Payment Verification" },
    { icon: FileCheck, label: "Document Processing" },
    { icon: BarChart3, label: "Reports" },
    { icon: Users, label: "User Management" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4ff] overflow-hidden">
      <Sidebar
        menuItems={menuItems}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Header />

        <MainContent selectedTab={selectedTab} onChangeTab={setSelectedTab} />
      </div>
    </div>
  );
}
