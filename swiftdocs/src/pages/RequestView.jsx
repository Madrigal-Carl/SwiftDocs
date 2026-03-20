import { Clock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

export default function RequestView() {
  const [request, setRequest] = useState({
    reference_number: "REQ-2026-0007",
    status: "pending",
    request_date: "2026-03-15",
    student: {
      fullName: "Maria Clara Santos",
      studentId: "2020-00412",
      email: "mariasantos@email.com",
      phone: "+63 912 345 6789",
      program: "Bachelor of Science in Computer Science",
      yearLevel: "4th Year",
    },
    document: {
      type: "Transcript of Records",
      purpose: "For employment application requirements",
      amount: 150.0,
    },
    payment: {
      amount: 150.0,
      status: "Invoiced", // Not Required, Invoiced, Paid, Verified
    },
    notes: [
      {
        id: 1,
        author: "Admin",
        text: "Initial request received. Awaiting payment confirmation.",
        date: "2026-03-15 09:30 AM",
      },
      {
        id: 2,
        author: "RMO",
        text: "Student called to confirm details. All requirements submitted.",
        date: "2026-03-15 02:15 PM",
      },
    ],
    files: [
      { name: "Valid_ID.pdf", size: "2.4 MB" },
      { name: "Authorization_Letter.pdf", size: "1.1 MB" },
      { name: "Proof_of_Payment.pdf", size: "0.8 MB" },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="bg-white border border-(--border-light) rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-(--text-dark)">
                {request.reference_number}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Submitted on {request.request_date}</span>
            </div>
          </div>

          {request.status !== "released" && request.status !== "rejected" && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-(--primary-600) text-white hover:bg-(--primary-700) transition-colors shadow-sm"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
