import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  MoreHorizontal,
  Pencil,
  Shield,
  Check,
  KeyRound,
  Ban,
} from "lucide-react";
import AccountModal from "./AccountModal";
import { getAccountById, updateAccount } from "../../services/account_service";

export default function ActionDropdown({ user, onClose, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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

  const handleEdit = async () => {
    try {
      const data = await getAccountById(user.id);
      setEditingUser(data.user || data);
      setIsModalOpen(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateAccount(user.id, data);
      setIsModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const actionText = newStatus === "active" ? "activate" : "deactivate";

    const result = await Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} user?`,
      text: `Are you sure you want to ${actionText} ${user.fullname || user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748b",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await updateAccount(user.id, { status: newStatus });
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
          throw error;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (!result.isConfirmed) return;

    if (onSuccess) onSuccess();
    setIsOpen(false);
  };

  const handleResetPassword = async () => {
    const result = await Swal.fire({
      title: "Reset password?",
      text: `This will reset ${user.fullname || user.email}'s password to SwiftDocs123. Continue?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await updateAccount(user.id, { newPassword: "SwiftDocs123" });
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
          throw error;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (!result.isConfirmed) return;

    if (onSuccess) onSuccess();
    setIsOpen(false);
  };

  const dropdown = isOpen ? (
    <div
      id="user-dropdown-portal"
      className="absolute w-40 bg-white rounded-lg shadow-lg border border-(--border-light) py-1 z-50"
      style={{ top: coords.top, left: coords.left }}
    >
      <button
        onClick={handleEdit}
        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors"
      >
        <Pencil className="w-4 h-4 text-gray-500" />
        Edit User
      </button>
      <button
        onClick={handleToggleStatus}
        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors"
      >
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleResetPassword();
        }}
        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-(--bg-light) flex items-center gap-2 cursor-pointer transition-colors"
      >
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

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEdit={true}
        initialData={editingUser}
        onSubmit={handleUpdate}
      />
    </>
  );
}
