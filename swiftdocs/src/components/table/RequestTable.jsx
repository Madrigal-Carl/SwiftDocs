import { useState, useEffect, useRef } from "react";
import StatusBadge from "../StatusBadge";
import ActionDropdown from "./ActionDropdown";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useRequestStore } from "../../stores/request_store";
import Pagination from "../Pagination";
import TableLoader from "../TableLoader";
import { useAuth } from "../../stores/auth_store";
import RequestActionModal from "../RequestActionModal.jsx";
import { showToast } from "../../utils/swal.js";
import { getNextStatus } from "../../utils/requestStatus.js";
import { updateRmoRequestStatus } from "../../services/rmo_service.js";
import {
  updateCashierRequestStatus,
  updateCashierRequestReview,
} from "../../services/cashier_service";

export default function RequestTable() {
  const { user } = useAuth();
  const { requests, loading, pagination, loadRequests, page, filters } =
    useRequestStore();

  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const prevFilters = useRef({ search: "", status: undefined });

  useEffect(() => {
    setSearchQuery(filters.search || "");
    setStatusFilter(filters.status);
    prevFilters.current = {
      search: filters.search || "",
      status: filters.status,
    };
  }, []);

  useEffect(() => {
    // Only reload if either search or status actually changed
    if (
      searchQuery === prevFilters.current.search &&
      statusFilter === prevFilters.current.status
    ) {
      return; // Nothing changed
    }

    const delay = setTimeout(() => {
      loadRequests(1, {
        search: searchQuery || undefined,
        status: statusFilter,
      });

      // Update previous values
      prevFilters.current = { search: searchQuery, status: statusFilter };
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery, statusFilter, loadRequests]);

  const getProcessingTime = (createdAt) => {
    if (!createdAt) return "-";

    const now = new Date();
    const created = new Date(createdAt); // ✅ direct parse

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

  const STATUS_MAP = {
    cashier: ["pending", "invoiced", "paid"],
    rmo: ["pending", "invoiced", "paid", "released", "rejected"],
    admin: ["pending", "invoiced", "paid", "released", "rejected"],
  };

  const formatLabel = (status) => {
    return status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getReleaseInfo = (expectedDate) => {
    if (!expectedDate) {
      return { label: "Not set", type: "neutral" };
    }

    const now = new Date();
    const release = new Date(expectedDate);

    if (isNaN(release)) {
      return { label: "Not set", type: "neutral" };
    }

    const diffMs = release - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return {
        label: `${days} day${days > 1 ? "s" : ""}`,
        type: "future",
      };
    }

    if (days === 0) {
      return {
        label: "Today",
        type: "today",
      };
    }

    return {
      label: `${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""}`,
      type: "past",
    };
  };

  const releaseStyles = {
    future: "bg-blue-100 text-blue-700",
    today: "bg-yellow-100 text-yellow-700",
    past: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-500",
  };

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
            value={statusFilter || ""}
            onChange={(e) =>
              setStatusFilter(
                e.target.value === "" ? undefined : e.target.value,
              )
            }
            className="appearance-none pl-9 pr-10 py-2 rounded-lg border border-(--border-light) bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-300) text-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_MAP[user.role]?.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
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
              {pagination.total || 0} results
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tr className="bg-(--bg-light) border-b border-(--border-light)">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Reference Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">
                Student Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date Requested
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Release
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
                <TableLoader colSpan={7} />
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
                      <td className="px-6 py-4 whitespace-nowrap w-[15%]">
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
                        {new Date(req.request_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {(() => {
                          if (req.status === "released") {
                            return (
                              <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                {req.request_completed}
                              </span>
                            );
                          }

                          const info = getReleaseInfo(
                            req.expected_release_date,
                          );

                          return (
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${releaseStyles[info.type]}`}
                            >
                              {info.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 capitalize text-center">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ActionDropdown
                          reference={req.reference_number}
                          status={req.status}
                          role={user.role}
                          other={req.other}
                          onApprove={() => {
                            setSelectedRequest({
                              ...req,
                              full_name: item.full_name,
                            });
                            setModalAction("approve");
                            setModalOpen(true);
                          }}
                          onReject={() => {
                            setSelectedRequest({
                              ...req,
                              full_name: item.full_name,
                            });
                            setModalAction("reject");
                            setModalOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          pages={pagination.pages || 1}
          onPageChange={(newPage) =>
            loadRequests(newPage, {
              search: searchQuery,
              status: statusFilter,
            })
          }
        />
      </div>
      <RequestActionModal
        isOpen={modalOpen}
        action={modalAction}
        request={selectedRequest}
        role={user.role}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
        onSubmit={async ({
          note,
          files,
          or_number,
          expected_release_date,
          bills,
        }) => {
          const nextStatus = getNextStatus(
            user.role,
            selectedRequest.status,
            modalAction,
          );

          if (!nextStatus) {
            showToast("error", "Invalid status transition");
            return;
          }

          try {
            if (user.role === "cashier") {
              const formData = new FormData();
              formData.append("status", nextStatus);
              formData.append("note", note);
              formData.append(
                "reference_number",
                selectedRequest.reference_number,
              );
              formData.append("or_number", or_number);

              (files || []).forEach((file) => {
                formData.append("proofs", file);
              });

              const isPaymentFlow =
                selectedRequest.status === "invoiced" && nextStatus === "paid";

              if (isPaymentFlow) {
                await updateCashierRequestStatus(selectedRequest.id, formData);
              } else {
                const reviewPayload = {
                  status: nextStatus,
                  note,
                };

                await updateCashierRequestReview(
                  selectedRequest.id,
                  reviewPayload,
                );
              }
            } else {
              await updateRmoRequestStatus(selectedRequest.id, {
                status: nextStatus,
                note,
                expected_release_date,
                bills: nextStatus === "invoiced" ? bills : undefined,
              });
            }

            showToast("success", `Request ${nextStatus} successfully!`);
            setModalOpen(false);
            setSelectedRequest(null);
            loadRequests(page);
          } catch (err) {
            showToast("error", err.message || err.message);
          }
        }}
      />
    </div>
  );
}
