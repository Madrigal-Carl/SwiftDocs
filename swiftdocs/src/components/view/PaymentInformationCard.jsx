import { PhilippinePeso, Eye, Clock, Mail } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function PaymentInformationCard({
  amount,
  status,
  deliveryMethod,
  proof = [],
}) {
  const showProof = status === "paid" || status === "released";
  const proofs = Array.isArray(proof) ? proof : [proof];

  return (
    <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-(--primary-100) flex items-center justify-center">
          <PhilippinePeso className="w-4 h-4 text-(--primary-600)" />
        </div>
        <h3 className="font-semibold text-(--text-dark)">
          Payment Information
        </h3>
      </div>

      <div className="divide-y divide-(--border-light)">
        {/* Delivery Method */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Delivery Method</span>
          <span className="text-sm font-medium text-(--text-dark) capitalize">
            {deliveryMethod?.replace("_", " ")}
          </span>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Amount</span>
          <span className="text-lg font-bold text-(--text-dark)">
            ₱{amount.toFixed(2)}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Status</span>
          <StatusBadge status={status} />
        </div>

        {/* Proof (multiple) */}
        {showProof && proofs.length > 0 && (
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-600">Proof</span>

            <div className="flex flex-col items-end gap-1">
              {proofs.map((file, index) => (
                <a
                  key={index}
                  href={`${import.meta.env.VITE_SERVER_URL}/${file.replace(/^\/+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-(--primary-600) hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  {file.split("/").pop()}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pending Notice */}
      {status === "pending" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-yellow-600" />
          <p className="text-xs text-yellow-700">
            Request is currently under review. Payment is not yet required.
          </p>
        </div>
      )}

      {/* Invoiced Notice */}
      {status === "invoiced" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-2">
          <Mail className="w-4 h-4 text-blue-600" />
          <p className="text-xs text-blue-700">
            Payment invoice has been sent to the student's email.
          </p>
        </div>
      )}
    </div>
  );
}
