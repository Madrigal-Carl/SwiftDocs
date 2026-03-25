import { useState } from "react";
import SectionHeader from "../../layouts/SectionHeader";
import UserStats from "../../components/users/UserStats";
import UserTable from "../../components/users/UserTable";
import AccountModal from "../../components/users/AccountModal";
import { register } from "../../services/auth_service";
import { showToast } from "../../utils/swal";

export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateUser = async (data) => {
    try {
      const res = await register(data);
      console.log("User created:", res);
      setIsModalOpen(false);
      showToast("success", "Account has been successfully created");
    } catch (err) {
      console.error("Create user failed:", err);
      showToast("error", err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <SectionHeader
        title="User Management"
        description="Manage system users and their access permissions"
        actionLabel="New User"
        onAction={() => setIsModalOpen(true)}
      />

      <UserStats />

      <UserTable />

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
