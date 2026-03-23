import { useState, useRef, useEffect } from "react";
import { useAuth } from "../stores/auth_store";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

export default function Header({ name }) {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-(--border-light) h-16 flex items-center justify-between px-8 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-(--text-dark)">{name}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-(--bg-light) transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div
          className="relative flex items-center gap-3 pl-4 border-l border-(--border-light) cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
          ref={dropdownRef}
        >
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-(--primary-500) to-(--primary-700) flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user.initials}
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-(--text-dark)">
              {user.fullname}
            </p>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-56 bg-white border border-(--border-light) rounded-lg shadow-lg overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-(--border-light)">
                <p className="text-sm font-semibold text-(--text-dark)">
                  My Account
                </p>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-(--bg-light)">
                <User className="w-4 h-4" />
                Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-(--bg-light)">
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <div className="border-t border-(--border-light)" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
