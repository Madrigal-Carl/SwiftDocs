import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function DocumentActionDropdown({
  doc, // renamed from `document`
  onEdit,
  onDelete,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !document.getElementById("doc-dropdown-portal")?.contains(event.target)
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
      id="doc-dropdown-portal"
      className="absolute w-40 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50"
      style={{ top: coords.top, left: coords.left }}
    >
      <button
        onClick={() => {
          setIsOpen(false);
          if (onEdit) onEdit(doc);
        }}
        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors"
      >
        <Pencil className="w-4 h-4 text-gray-500" />
        Edit
      </button>

      <button
        onClick={() => {
          setIsOpen(false);
          if (onDelete) onDelete(doc);
        }}
        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
        Delete
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
