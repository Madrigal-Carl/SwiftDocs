import { useState } from "react";
import StatusBadge from "./StatusBadge";
import ActionDropdown from "./ActionDropdown";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useRequestStore } from "../stores/request/request_store";

export default function RequestTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const { requests, loading } = useRequestStore();

  return (
    <div className="flex flex-col gap-4 flex-1 mx-auto w-full">
      {/* Filters Bar */}
      <div className="bg-white border border-(--border-light) rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, or reference code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-(--border-light) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-300) focus:border-transparent text-sm"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2 rounded-lg border border-(--border-light) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-300) text-sm cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Payment Pending</option>
            <option>Processing</option>
            <option>Ready for Release</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-(--border-light) rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-(--border-light) flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-(--text-dark)">All Requests</h3>
            <span className="px-2 py-0.5 bg-(--primary-100) text-(--primary-700) text-xs font-medium rounded-full">
              {requests.length} results
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tr className="bg-(--bg-light) border-b border-(--border-light)">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Reference Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">
                Student Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date Requested
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            <tbody className="divide-y divide-(--border-light)">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((item) => {
                  const req = item.request;
                  if (!req) return null;

                  return (
                    <tr key={item.id} className="hover:bg-(--primary-50)">
                      <td className="px-6 py-4 text-sm font-medium text-(--primary-600) uppercase">
                        {req.reference_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-[25%]">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-(--text-dark)">
                            {item.full_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.lrn}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {req.total_documents}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {req.request_date}
                      </td>
                      <td className="px-6 py-4 capitalize text-center">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ActionDropdown request={item} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
