import api from "../api/api";

export async function updateRmoRequestStatus(
  id,
  status,
  note,
  additional_documents = [],
) {
  const res = await api.patch(`/rmo/requests/${id}/status`, {
    status,
    note,
    additional_documents,
  });

  return res.data;
}
