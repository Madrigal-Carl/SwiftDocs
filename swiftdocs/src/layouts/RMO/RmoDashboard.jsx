import { useState } from "react";
import Sidebar from "../Sidebar";
import MainContent from "../MainContent";
import {
  LayoutDashboard,
  FileCheck,
  BarChart3,
  FilePlusCorner,
  UserCog,
} from "lucide-react";

export default function RmoDashboard() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FileCheck, label: "Document Processing" },
    { icon: BarChart3, label: "Reports" },
    { icon: FilePlusCorner, label: "Document" },
    { icon: UserCog, label: "Profile" },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4ff] overflow-hidden">
      <Sidebar
        menuItems={menuItems}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <MainContent selectedTab={selectedTab} onChangeTab={setSelectedTab} />
      </div>
    </div>
  );
}
