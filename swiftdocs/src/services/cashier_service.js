import api from "../api/api";

export async function fetchCashierRequests(page = 1, limit = 10, filters = {}) {
  const res = await api.get("/cashier/requests", {
    params: {
      page,
      limit,
      search: filters.search || "",
      status: filters.status || "",
    },
  });

  return res.data;
}

export async function updateCashierRequestStatus(id, formData) {
  const res = await api.patch(`/cashier/requests/${id}/status`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
