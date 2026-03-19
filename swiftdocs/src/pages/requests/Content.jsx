import RequestTable from "../../components/table/RequestTable";
import ContentHeader from "../../layouts/ContentHeader";

export default function Content() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ContentHeader
        title="Document Requests"
        description="Manage and review all student document requests"
      />

      <RequestTable />
    </div>
  );
}
