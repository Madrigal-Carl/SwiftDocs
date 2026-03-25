import { useState, useEffect } from "react";
import { Lock, Mail, Shield } from "lucide-react";
import { useAuth } from "../../stores/auth_store";
import { updateAccount, changePassword } from "../../services/account_service";
import { showToast } from "../../utils/swal";
import FormInput from "./FormInput";

export default function ProfileForm() {
  const { user, reloadUser } = useAuth();

  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });

  // 🔒 Password state (UI only, not used here)
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // populate form
  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });

    // 🔥 ALWAYS RESET PASSWORD FIELDS
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field in passwords) {
      setPasswords((prev) => ({ ...prev, [field]: value }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      showToast("error", "User not found");
      return;
    }

    setIsSaving(true);

    try {
      // 1️⃣ Update profile
      const profilePayload = {
        first_name: form.firstName,
        middle_name: form.middleName,
        last_name: form.lastName,
        email: form.email,
      };

      await updateAccount(user.id, profilePayload);

      // 2️⃣ Check if user wants to change password
      const isChangingPassword =
        passwords.currentPassword ||
        passwords.newPassword ||
        passwords.confirmPassword;

      if (isChangingPassword) {
        // validate password fields
        if (!passwords.currentPassword) throw new Error("Current password is required");
        if (!passwords.newPassword) throw new Error("New password is required");
        if (!passwords.confirmPassword) throw new Error("Confirm password is required");
        if (passwords.newPassword !== passwords.confirmPassword) throw new Error("Passwords do not match");

        // call change password endpoint
        await changePassword({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        });
      }

      // Reload user info after updates
      await reloadUser();

      showToast(
        "success",
        isChangingPassword
          ? "Profile & password updated successfully"
          : "Profile updated successfully"
      );

      // Reset password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Failed to update";
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });

    // 🔥 RESET PASSWORDS ON CANCEL
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-(--border-light) shadow-sm">
      <div className="p-6 border-b border-(--border-light)">
        <h3 className="text-lg font-semibold text-(--text-dark)">
          Account Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal information and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Personal Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="First Name"
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
            <FormInput
              label="Middle Name"
              value={form.middleName}
              onChange={handleChange("middleName")}
            />
            <FormInput
              label="Last Name"
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              icon={Mail}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Role
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border text-gray-500 text-sm uppercase">
                <Shield className="w-4 h-4" />
                {user?.role}
                <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">
                  Read-only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password (UI ONLY) */}
        <div className="space-y-4 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Change Password
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={handleChange("currentPassword")}
              icon={Lock}
            />

            <div className="hidden md:block"></div>

            <FormInput
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange("newPassword")}
              icon={Lock}
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange("confirmPassword")}
              icon={Lock}
            />
          </div>

          <p className="text-xs text-gray-500">
            This section will be handled in a separate endpoint.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg text-white bg-(--primary-600) disabled:opacity-70 flex items-center gap-2"
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