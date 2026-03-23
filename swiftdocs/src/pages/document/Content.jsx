import SectionHeader from "../../layouts/SectionHeader";

export default function Content() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <SectionHeader
        title="Document Management"
        description="Manage document types, pricing, and availability"
        actionLabel="New Document"
        onAction={() => console.log("clicked")}
      />
    </div>
  );
}
