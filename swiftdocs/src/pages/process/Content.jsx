import { useParams } from "react-router-dom";
import RequestTable from "../../components/table/RequestTable";
import SectionHeader from "../../layouts/SectionHeader";
import RequestView from "../../pages/RequestView";

export default function Content() {
  const { reference_number } = useParams();

  return (
    <div className="flex flex-col gap-6 p-6">
      {!reference_number ? (
        <>
          <SectionHeader
            title="Document Processing"
            description="Process approved document requests and manage releases"
            actionLabel="New Request"
            onAction={() => console.log("clicked")}
          />
          <RequestTable />
        </>
      ) : (
        <RequestView referenceNumber={reference_number} />
      )}
    </div>
  );
}
