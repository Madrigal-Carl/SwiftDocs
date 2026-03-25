import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !document.getElementById("user-dropdown-portal")?.contains(event.target)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 160;

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX + rect.width / 2 - dropdownWidth / 2,
      });
    }

    setIsOpen(!isOpen);
  };

  const dropdown = isOpen ? (
    <div
      id="user-dropdown-portal"
      className="absolute w-40 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50"
      style={{ top: coords.top, left: coords.left }}
    >
      <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors">
        <Pencil className="w-4 h-4 text-gray-500" />
        Edit User
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
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-2 rounded-md hover:bg-(--bg-light) transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {createPortal(dropdown, document.body)}
    </>
  );
}
