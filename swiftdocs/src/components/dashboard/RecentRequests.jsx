import { ChevronRight } from "lucide-react";
import StatusBadge from "../StatusBadge";
import { useRequestStore } from "../../stores/request_store";
import { useAuth } from "../../stores/auth_store";
import { getTabByRole } from "../../utils/role_tabs";

export default function RecentRequests({ onChangeTab }) {
  const { requests, loading, pagination, page, loadRequests } =
    useRequestStore();
  const { user } = useAuth();

  const targetTab = getTabByRole(user?.role);

  const getProcessingTime = (createdAt) => {
    if (!createdAt) return "-";

    const now = new Date();
    const created = new Date(createdAt);

    if (isNaN(created)) return "-";

    const diffMs = now - created;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} min`;
    return "Just now";
  };

  return (
    <div className="bg-white border border-(--border-light) rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-(--border-light) flex items-center justify-between">
        <h3 className="font-semibold text-(--text-dark)">Recent Requests</h3>
        <button
          onClick={() => onChangeTab(targetTab)}
          className="text-sm font-medium text-(--primary-600) hover:text-(--primary-700) flex items-center gap-1 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-(--bg-light) border-b border-(--border-light)">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Reference Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Student Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                Documents
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                Date Requested
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                Requested
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border-light)">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              // Limit to 6 items
              requests.slice(0, 6).map((item) => {
                const req = item.request;
                if (!req) return null;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-(--primary-50) transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-(--primary-600) uppercase">
                      {req.reference_number}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-(--text-dark)">
                      {item.full_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {req.total_documents}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {new Date(req.request_date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {getProcessingTime(req.created_at)}
                    </td>

                    <td className="px-6 py-4 text-center capitalize">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
