import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import { LayoutDashboard, CreditCard, Settings } from "lucide-react";

export default function CashierDashboard() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: CreditCard, label: "Payment Verification" },
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
        <div className="flex-1 p-6 overflow-auto">
          <MainContent selectedTab={selectedTab} />
        </div>
      </div>
    </div>
  );
}
