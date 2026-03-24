import { useState, useEffect } from "react";
import { Lock, Mail, Shield } from "lucide-react";
import { useProfileStore } from "../../stores/profile_store";
import FormInput from "./FormInput";

export default function ProfileForm() {
  const { profile, updateProfile, resetProfile } = useProfileStore();
  const [isSaving, setIsSaving] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [profile.id]);

  const handleChange = (field) => (e) => {
    // change
  };

  const handleSubmit = (e) => {
    // Update
  };

  const handleCancel = () => {
    // Cancel
  };

  return (
    <div className="bg-white rounded-xl border border-(--border-light) shadow-sm">
      <div className="p-6 border-b border-(--border-light)">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-(--text-dark)">
              Account Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your personal information and password.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Name Fields */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="First Name"
              value={profile.firstName}
              onChange={handleChange("firstName")}
              placeholder="Enter first name"
            />
            <FormInput
              label="Middle Name"
              value={profile.middleName}
              onChange={handleChange("middleName")}
              placeholder="Enter middle name"
            />
            <FormInput
              label="Last Name"
              value={profile.lastName}
              onChange={handleChange("lastName")}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={handleChange("email")}
              placeholder="Enter email address"
              icon={Mail}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Role
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-sm cursor-not-allowed capitalize">
                <Shield className="w-4 h-4" />
                {profile.role}
                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                  Read-only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4 pt-6 border-t border-(--border-light)">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Change Password
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={handleChange("currentPassword")}
              placeholder="Enter current password"
              icon={Lock}
            />
            <div className="hidden md:block"></div>
            <FormInput
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange("newPassword")}
              placeholder="Enter new password"
              icon={Lock}
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="Confirm new password"
              icon={Lock}
            />
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long and include a mix of
            letters, numbers, and symbols.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--border-light)">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-(--primary-600) hover:bg-(--primary-700) shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--primary-300) disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
