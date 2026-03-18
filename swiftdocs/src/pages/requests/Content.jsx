import RequestTable from "../../components/tableo/RequestTable";
import ContentHeader from "../../layouts/ContentHeader";

export default function Content() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-6 min-h-0">
      <ContentHeader
        title="Document Requests"
        description="Manage and review all student document requests"
      />

      <RequestTable />
    </div>
  );
}
