import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function DocumentActionDropdown({
  doc, // renamed from `document`
  onEdit,
  onDelete,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      window.document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      window.document.removeEventListener("mousedown", handleClickOutside);
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
      )}
    </div>
  );
}
