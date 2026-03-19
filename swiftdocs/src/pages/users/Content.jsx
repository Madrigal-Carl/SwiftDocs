import SectionHeader from "../../layouts/SectionHeader";
import UserStats from "../../components/users/UserStats";
import UserTable from "../../components/users/UserTable";

export default function Content() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6">
      <SectionHeader
        title="User Management"
        description="Manage system users and their access permissions"
        actionLabel="New User"
        onAction={() => console.log("clicked")}
      />

      <UserStats />

      <UserTable />
    </div>
  );
}
