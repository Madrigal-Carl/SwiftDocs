import { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import MainContent from "../MainContent";
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
      <MainContent selectedTab={selectedTab} onChangeTab={setSelectedTab} />
    </div>
  );
}
