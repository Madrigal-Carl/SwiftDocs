import { useParams } from "react-router-dom";
import { useState } from "react";

import RequestTable from "../../components/table/RequestTable";
import SectionHeader from "../../layouts/SectionHeader";
import RequestView from "../../pages/RequestView";
import RequestModal from "../../Components/RequestModal";

export default function Content() {
  const { reference_number } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      {!reference_number ? (
        <>
          <SectionHeader
            title="Document Processing"
            description="Process approved document requests and manage releases"
            actionLabel="New Request"
            onAction={() => setIsModalOpen(true)} // ✅ OPEN MODAL
          />

          <RequestTable />

          {/* ✅ ALWAYS render modal, control via isOpen */}
          <RequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      ) : (
        <RequestView referenceNumber={reference_number} />
      )}
    </div>
  );
}