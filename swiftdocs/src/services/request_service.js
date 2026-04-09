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

export const createRequest = (data) => {
  return api.post("/request", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export async function requestEmailStatus(referenceNumber) {
  const res = await api.post(`/request/status/${referenceNumber}/send-email`);
  return res.data;
}

export async function fetchRequestAnalytics(timeframe = "year") {
  const res = await api.get("/request/analytics", {
    params: { timeframe },
  });
  return res.data;
}
