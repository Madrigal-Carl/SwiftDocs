import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";

export default function ActionDropdown({ ref }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 200) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-2 rounded-md hover:bg-(--primary-50) transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 w-48 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50
          ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <button
            onClick={() => {
              navigate(`/request/${ref}`);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Request
          </button>
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Approve
          </button>
          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
