import api from "../api/api";

export async function fetchAllRequests(page = 1, limit = 10, filters = {}) {
  const res = await api.get("/request", {
    params: {
      page,
      limit,
      search: filters.search || "",
      status: filters.status || "",
    },
  });

  return res.data;
}

export async function fetchRequestById(id) {
  const res = await api.get(`/request/${id}`);
  return res.data;
}

export async function fetchRequestByReference(referenceNumber) {
  const res = await api.get(`/request/reference/${referenceNumber}`);
  return res.data;
}

export async function createRequest(data) {
  const res = await api.post("/request", data);
  return res.data;
}

export async function requestEmailStatus(referenceNumber) {
  try {
    const res = await api.post(`/request/status/${referenceNumber}/send-email`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch request" };
  }
}

export async function fetchRequestAnalytics() {
  const res = await api.get("/request/analytics");
  return res.data;
}
