import { useAuth } from "../stores/auth/auth_store";
import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-(--border-light) h-16 flex items-center justify-between px-8 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-(--text-dark)">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-(--bg-light) transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-(--border-light)">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-(--primary-500) to-(--primary-700) flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user.initials}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-(--text-dark)">
              {user.fullname}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
