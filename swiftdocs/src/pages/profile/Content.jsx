import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import ContentHeader from "../../layouts/ContentHeader";

export default function Content() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ContentHeader
        title="Profile Settings"
        description="Manage your personal account information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>
        <div className="lg:col-span-3">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
