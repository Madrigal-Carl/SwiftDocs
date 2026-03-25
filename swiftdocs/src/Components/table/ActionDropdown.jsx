import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";
import { getRequestPermissions } from "../../utils/requestPermissions";

export default function ActionDropdown({
  reference,
  status,
  role,
  onApprove,
  onReject,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const { view, approve, reject } = getRequestPermissions(role, status);

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

  useEffect(() => {
    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192;

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX + rect.width / 2 - dropdownWidth / 2,
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
      {view && (
        <button
          onClick={() => {
            navigate(`/request/${reference}`);
            setIsOpen(false);
          }}
          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Request
        </button>
      )}

      {approve && status !== "pending" && (
        <button
          onClick={() => {
            onApprove?.();
            setIsOpen(false);
          }}
          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-green-600" />
          Approve
        </button>
      )}

      {reject && (
        <button
          onClick={() => {
            onReject?.();
            setIsOpen(false);
          }}
          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--primary-50) flex items-center gap-2"
        >
          <X className="w-4 h-4 text-red-600" />
          Reject
        </button>
      )}
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
