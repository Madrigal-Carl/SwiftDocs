import { useState } from "react";
import { Search } from "lucide-react";
import { useDocumentStore } from "../../stores/document_store";
import Pagination from "../Pagination";
import TableLoader from "../TableLoader";
import ActionDropdown from "./ActionDropdown";

export default function DocumentTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const { documents, loading, pagination, loadDocuments, page } =
    useDocumentStore();

  return (
    <div className="flex flex-col gap-4 flex-1 mx-auto w-full">
      {/* Filters Bar */}
      <div className="bg-white border border-(--border-light) rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search document type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-(--border-light) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-300) focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-(--border-light) rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-(--border-light) flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-(--text-dark)">All Documents</h3>
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
                  Document Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Added At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border-light)">
              {loading ? (
                <TableLoader colSpan={4} rows={5} />
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-(--bg-light)/50">
                    <td className="px-6 py-4 text-sm font-medium capitalize">
                      {doc.type}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₱{Number(doc.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <ActionDropdown
                        doc={doc}
                        onEdit={(doc) => console.log("Edit", doc)}
                        onDelete={(doc) => console.log("Delete", doc)}
                      />
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
          onPageChange={loadDocuments}
        />
      </div>
    </div>
  );
}
