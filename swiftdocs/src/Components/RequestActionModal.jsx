import { useState } from "react";
import { X, FileText, User } from "lucide-react";

export default function RequestActionModal({
  isOpen,
  onClose,
  onSubmit,
  request,
  action,
}) {
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]);

  if (!isOpen || !request) return null;

  // Determine full name safely
  const fullName = request.student
    ? `${request.student.first_name} ${request.student.middle_name} ${request.student.last_name}${request.student.suffix ? `, ${request.student.suffix}` : ""}`
    : request.full_name || "Unknown";

  const handleSubmit = async () => {
    await onSubmit(remarks, files);
    setRemarks("");
    setFiles([]);
  };

  const isReject = action === "reject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="glass-morphism w-full max-w-lg rounded-xl shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-(--text-dark)">
            {isReject ? "Reject Request" : "Approve Request"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-(--bg-light)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Request Info */}
        <div className="space-y-4 mb-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-(--bg-light)">
            <FileText className="w-4 h-4 mt-1 text-(--primary-600)" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Reference Number
              </p>
              <p className="text-sm font-semibold text-(--text-dark) uppercase">
                {request.reference_number}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-(--bg-light)">
            <User className="w-4 h-4 mt-1 text-(--primary-600)" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Student Name
              </p>
              <p className="text-sm font-semibold text-(--text-dark)">
                {fullName}
              </p>
              {request.lrn && (
                <p className="text-xs text-gray-400 mt-1">LRN: {request.lrn}</p>
              )}
            </div>
          </div>
        </div>

        {action === "approve" && (
          <div className="mb-6">
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Upload Payment Proofs
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full mt-2 text-sm"
            />

            {files.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        )}

        {/* Remarks */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Remarks
          </label>
          <textarea
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..."
            className="w-full mt-2 p-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-(--border-light) hover:bg-(--bg-light)"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-colors
              ${
                isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-(--primary-600) hover:bg-(--primary-700)"
              }`}
          >
            {isReject ? "Reject Request" : "Approve Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
