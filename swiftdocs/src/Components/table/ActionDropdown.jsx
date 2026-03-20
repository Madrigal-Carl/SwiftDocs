import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";

export default function ActionDropdown({ ref }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !document.getElementById("dropdown-portal")?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 48*4 px = 192px

      setCoords({
        top: rect.bottom + window.scrollY + 4, // 4px spacing below button
        left: rect.left + window.scrollX + rect.width / 2 - dropdownWidth / 2, // center horizontally
      });
    }
    setIsOpen(!isOpen);
  };

  const dropdown = isOpen ? (
    <div
      id="dropdown-portal"
      className="absolute w-48 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50"
      style={{ top: coords.top, left: coords.left }}
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
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-2 rounded-md hover:bg-(--primary-50) transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>
      {createPortal(dropdown, document.body)}
    </>
  );
}
