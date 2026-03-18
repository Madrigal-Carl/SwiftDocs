import { useState } from "react";
import Sidebar from "../Sidebar";
import MainContent from "../MainContent";
import { LayoutDashboard, FileCheck, Settings } from "lucide-react";

export default function RmoDashboard() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FileCheck, label: "Document Processing" },
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
