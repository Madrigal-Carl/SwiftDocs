import { useState } from "react";
import { X, FileText, User } from "lucide-react";

export default function RequestActionModal({
  isOpen,
  onClose,
  onSubmit,
  request,
  action,
  role,
}) {
  const [remarks, setRemarks] = useState("");
  const [expectedReleaseDate, setExpectedReleaseDate] = useState("");
  const [files, setFiles] = useState([]);
  const [orNumber, setOrNumber] = useState(
    request ? request.or_number || "" : "",
  );
  const [bills, setBills] = useState([{ name: "", price: "" }]);
  const handleBillChange = (index, field, value) => {
    setBills((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };
  const addBill = () => {
    setBills((prev) => [...prev, { name: "", price: "" }]);
  };
  const removeBill = (index) => {
    setBills((prev) => prev.filter((_, i) => i !== index));
  };
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const getApproveLabel = () => {
    switch (request.status) {
      case "pending":
      case "balance_due":
        return "Validate Request";
      case "under_review":
      case "deficient":
        return "Send to Billing";
      case "invoiced":
        return "Mark Paid";
      case "paid":
        return "Release Request";
      default:
        return "Approve Request";
    }
  };

  const fullName = request.student
    ? `${request.student.first_name} ${request.student.middle_name} ${request.student.last_name}${request.student.suffix ? `, ${request.student.suffix}` : ""}`
    : request.full_name || "Unknown";

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const validBills = bills.filter(
        (b) => b.name?.trim() !== "" || b.price?.toString().trim() !== "",
      );

      await onSubmit({
        note: remarks,
        files,
        or_number: orNumber,
        expected_release_date: expectedReleaseDate,
        ...(validBills.length > 0 && { bills: validBills }),
      });
      setRemarks("");
      setFiles([]);
      setExpectedReleaseDate("");
      setOrNumber("");
    } finally {
      setSubmitting(false);
    }
  };

  const isReject = action === "reject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="glass-morphism w-full max-w-lg rounded-xl shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-(--text-dark)">
            {isReject ? "Decline Request" : getApproveLabel()}
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

        {/* Cashier Actions */}
        {action === "approve" &&
          role === "cashier" &&
          request.status === "invoiced" && (
            <div className="mb-6">
              {/* File Upload */}
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Upload Payment Proofs
              </label>

              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full p-4 border border-dashed border-(--border-light) rounded-lg cursor-pointer bg-(--bg-light) hover:bg-white transition">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileText className="w-6 h-6 text-(--primary-500) mb-2" />
                    <p className="text-sm font-medium text-(--text-dark)">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG (multiple allowed)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>

                {/* Selected files */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-(--bg-light) border border-(--border-light)"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* OR Number Input */}
              <div className="mt-4">
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  OR Number
                </label>
                <input
                  type="text"
                  value={orNumber}
                  onChange={(e) => setOrNumber(e.target.value)}
                  placeholder="Enter OR number"
                  className="w-full mt-2 p-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                />
              </div>

              {files.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {files.length} file(s) selected
                </p>
              )}
            </div>
          )}

        {role === "rmo" &&
          (request.status === "under_review" ||
            request.status === "deficient") &&
          action === "approve" && (
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Bills
                </label>

                <div className="mt-2 space-y-3">
                  {bills.map((bill, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center p-3 border border-(--border-light) rounded-lg bg-(--bg-light)"
                    >
                      {/* Name */}
                      <input
                        type="text"
                        value={bill.name}
                        onChange={(e) =>
                          handleBillChange(index, "name", e.target.value)
                        }
                        placeholder="Bill name"
                        className="flex-1 p-2 text-sm border border-(--border-light) rounded-md focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                      />

                      {/* Price */}
                      <input
                        type="number"
                        value={bill.price}
                        onChange={(e) =>
                          handleBillChange(index, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="w-28 p-2 text-sm border border-(--border-light) rounded-md focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                      />

                      {/* Remove */}
                      {bills.length > 1 && (
                        <button
                          onClick={() => removeBill(index)}
                          className="text-red-500 text-xs hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Button */}
                  <button
                    onClick={addBill}
                    className="text-xs text-(--primary-600) hover:underline"
                  >
                    + Add another bill
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Expected Release Date
                </label>

                <input
                  type="date"
                  value={expectedReleaseDate}
                  onChange={(e) => setExpectedReleaseDate(e.target.value)}
                  className="w-full mt-2 p-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                />
              </div>
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
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-lg border border-(--border-light) hover:bg-(--bg-light) disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-colors flex items-center justify-center gap-2
              ${submitting ? "opacity-60 cursor-not-allowed" : ""}
              ${isReject ? "bg-red-600 hover:bg-red-700" : "bg-(--primary-600) hover:bg-(--primary-700)"}
            `}
          >
            {submitting
              ? "Processing..."
              : isReject
                ? "Decline Request"
                : getApproveLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
