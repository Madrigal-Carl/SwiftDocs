import api from "../api/api";

export async function updateRmoAdditionalDocumentPrices(
  id,
  additional_documents,
) {
  const res = await api.patch(`/rmo/requests/${id}/additional-documents`, {
    additional_documents,
  });

  return res.data;
}

export async function updateRmoRequestStatus(id, data) {
  const res = await api.patch(`/rmo/requests/${id}/status`, data);
  return res.data;
}
