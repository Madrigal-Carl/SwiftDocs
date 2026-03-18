import api from "../api/api";

export async function fetchAllRequests(page = 1, limit = 6) {
  const res = await api.get("/request", {
    params: { page, limit },
  });

  return res.data;
}

export async function fetchRequestById(id) {
  const res = await api.get(`/request/${id}`);
  return res.data;
}

export async function createRequest(data) {
  const res = await api.post("/request", data);
  return res.data;
}
