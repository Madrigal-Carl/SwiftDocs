import { useParams } from "react-router-dom";
import RequestTable from "../../components/table/RequestTable";
import ContentHeader from "../../layouts/ContentHeader";
import RequestView from "../../pages/RequestView";

export default function Content() {
  const { reference_number } = useParams();

  return (
    <div className="flex flex-col gap-6 p-6">
      {!reference_number ? (
        <>
          <ContentHeader
            title="Document Requests"
            description="Manage and review all student document requests"
          />
          <RequestTable />
        </>
      ) : (
        <RequestView referenceNumber={reference_number} />
      )}
    </div>
  );
}
