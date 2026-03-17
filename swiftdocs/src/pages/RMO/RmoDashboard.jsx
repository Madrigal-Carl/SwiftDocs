import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { LayoutDashboard, FileCheck, Settings } from "lucide-react";

export default function RmoDashboard() {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
      href: "index.html",
    },
    {
      icon: FileCheck,
      label: "Document Processing",
      active: false,
      href: "document-processing.html",
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
