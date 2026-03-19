import SectionHeader from "../../layouts/SectionHeader";
import UserStats from "../../components/users/UserStats";

export default function Content() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-6 min-h-0">
      <SectionHeader
        title="User Management"
        description="Manage system users and their access permissions"
        actionLabel="New User"
        onAction={() => console.log("clicked")}
      />

      <UserStats />
    </div>
  );
}
