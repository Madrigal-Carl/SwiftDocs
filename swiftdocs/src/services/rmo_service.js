import api from "../api/api";

export async function updateRmoRequestStatus(
  id,
  status,
  note,
  additional_documents = [],
) {
  const payload = {
    status,
    note,
  };

  if (status === "invoiced" && additional_documents.length > 0) {
    payload.additional_documents = additional_documents;
  }

  const res = await api.patch(`/rmo/requests/${id}/status`, payload);

  return res.data;
}
