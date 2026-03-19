import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  Shield,
  Check,
  KeyRound,
  Ban,
} from "lucide-react";

export default function ActionDropdown({ user, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-(--bg-light) transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50">
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors">
            <Pencil className="w-4 h-4 text-gray-500" />
            Edit User
          </button>
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors">
            <Shield className="w-4 h-4 text-gray-500" />
            Change Role
          </button>
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors">
            {user.status === "active" ? (
              <>
                <Ban className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Deactivate</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Activate</span>
              </>
            )}
          </button>
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors">
            <KeyRound className="w-4 h-4 text-gray-500" />
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
