import ContentHeader from "../../layouts/ContentHeader";

export default function Content() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6">
      <ContentHeader
        title="Reports & Analytics"
        description="Track performance metrics and document request insights"
      />
    </div>
  );
}
