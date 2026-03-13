import api from "../api/api";

export async function updateRmoRequestStatus(id, status) {
  const res = await api.patch(`/rmo/requests/${id}/status`, {
    status,
  });
  return res.data;
}