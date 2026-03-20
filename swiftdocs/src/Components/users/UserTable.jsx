import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useAccountStore } from "../../stores/account_store";
import Pagination from "../Pagination";
import TableLoader from "../TableLoader";
import ActionDropdown from "./ActionDropdown";
import StatusBadge from "../StatusBadge";
import RoleBadge from "./RoleBadge";

export default function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const { accounts, loading, pagination, loadAccounts, page } =
    useAccountStore();

  useEffect(() => {
    loadAccounts(1);
  }, []);

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
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-(--border-light) rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-(--border-light) flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-(--text-dark)">All Users</h3>
            <span className="px-2 py-0.5 bg-(--primary-100) text-(--primary-700) text-xs font-medium rounded-full">
              {pagination.total || 0} results
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-(--bg-light) border-b border-(--border-light)">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Joined at
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-light)">
              {loading ? (
                <TableLoader colSpan={6} rows={5} />
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                accounts.map((user) => (
                  <tr key={user.id} className="hover:bg-(--bg-light)/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--primary-400) to-(--primary-600) text-white flex items-center justify-center font-semibold text-sm">
                          {user.full_name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">
                          {user.full_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4 capitalize">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <ActionDropdown user={user} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          pages={pagination.pages || 1}
          onPageChange={loadAccounts}
        />
      </div>
    </div>
  );
}
