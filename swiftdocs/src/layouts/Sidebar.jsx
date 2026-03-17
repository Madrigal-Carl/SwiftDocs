import { useAuth } from "../stores/auth/auth_store";
import { ChevronDown } from "lucide-react";
import logo from "../assets/white_outline_logo.png";

export default function Sidebar({ menuItems = [], selectedTab, onSelectTab }) {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-(--primary-900) flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Logo Section */}
      <div className="p-6 border-b border-(--primary-800)">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SwiftDocs Logo" className="w-10 h-10" />
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              SwiftDocs
            </h1>
            <p className="text-(--primary-200) text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.label;

            return (
              <li key={index}>
                <button
                  onClick={() => onSelectTab(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-(--primary-800) text-white shadow-lg shadow-black/10"
                      : "text-(--primary-200) hover:bg-(--primary-800)/40 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-(--primary-800)">
        <div className="flex items-center gap-3 bg-(--primary-800)/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--primary-400) to-(--primary-600) flex items-center justify-center text-white font-semibold shadow-lg">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user.fullname}
            </p>
            <p className="text-(--primary-200) text-xs truncate capitalize">
              {user.role}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-(--primary-200)" />
        </div>
      </div>
    </aside>
  );
}
