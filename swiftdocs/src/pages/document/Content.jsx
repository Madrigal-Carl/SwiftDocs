import { useState } from "react";
import SectionHeader from "../../layouts/SectionHeader";
import DocumentTable from "../../components/documents/DocumentTable";
import DocumentModal from "../../components/documents/DocumentModal";
import { createDocument } from "../../services/document_service";
import { showToast } from "../../utils/swal";

export default function Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateDocument = async (data) => {
    try {
      // Map 'name' to 'type' as your backend expects
      const payload = {
        type: data.name,
        price: Number(data.price), // ensure it's a number
      };

      // Send request to backend
      await createDocument(payload);

      // ✅ Show success toast
      showToast("success", "Document created successfully!");
    } catch (error) {
      console.error("Failed to create document:", error);

      // ✅ Show error toast from backend
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create document";

      showToast("error", message);
    } finally {
      setIsModalOpen(false); // close modal
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <SectionHeader
        title="Document Management"
        description="Manage document types, pricing, and availability"
        actionLabel="New Document"
        onAction={() => setIsModalOpen(true)}
      />

      <DocumentTable />

      {/* Document Modal */}
      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDocument}
      />
    </div>
  );
}
