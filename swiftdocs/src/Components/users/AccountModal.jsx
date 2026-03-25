import { useState, useEffect } from "react";
import { ChevronDown, Shield, X, User, Mail } from "lucide-react";

export default function AccountModal({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  initialData = null,
}) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("rmo");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setFirstName(initialData.firstName || initialData.first_name || "");
      setMiddleName(initialData.middleName || initialData.middle_name || "");
      setLastName(initialData.lastName || initialData.last_name || "");
      setEmail(initialData.email || "");
      setRole(initialData.role || "rmo");
    } else if (!isEdit) {
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setEmail("");
      setRole("rmo");
    }
  }, [isEdit, initialData]);

  const handleClose = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setRole("rmo");
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (onSubmit) {
        await onSubmit({
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
          email,
          role,
        });
      }

      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const previewName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="glass-morphism w-full max-w-lg rounded-xl shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-(--text-dark)">
            {isEdit ? "Edit Account" : "Create Account"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-(--bg-light)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-(--bg-light) mb-5">
          <User className="w-4 h-4 mt-1 text-(--primary-600)" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Account Preview
            </p>
            <p className="text-sm font-semibold text-(--text-dark)">
              {previewName.trim() || "Full Name"}
            </p>
            <p className="text-xs text-gray-500">
              {email || "email@example.com"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* First Name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              First Name
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name..."
                className="w-full pl-9 pr-3 py-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Middle Name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Middle Name (Optional)
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Enter middle name..."
                className="w-full pl-9 pr-3 py-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Last Name
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name..."
                className="w-full pl-9 pr-3 py-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Email
            </label>
            <div className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
                className="w-full pl-9 pr-3 py-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Role
            </label>
            <div className="relative mt-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none w-full pl-9 pr-10 py-3 text-sm rounded-lg border border-(--border-light) focus:outline-none focus:ring-2 focus:ring-(--primary-500) cursor-pointer"
              >
                <option value="rmo">RMO</option>
                <option value="cashier">Cashier</option>
              </select>

              {/* Left Icon */}
              <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

              {/* Custom Dropdown Icon */}
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-lg border border-(--border-light) hover:bg-(--bg-light) disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-colors
              ${submitting ? "opacity-60 cursor-not-allowed" : ""}
              bg-(--primary-600) hover:bg-(--primary-700)
            `}
          >
            {submitting
              ? "Processing..."
              : isEdit
                ? "Update Account"
                : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
