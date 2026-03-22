import api from "../api/api";

export async function updateRmoRequestStatus(id, status, note) {
  const res = await api.patch(`/rmo/requests/${id}/status`, {
    status,
    note,
  });

  return res.data;
}

export async function setAdditionalDocumentPrice(
  requestId,
  additionalDocumentId,
  unitPrice,
) {
  const res = await api.patch(`/rmo/additional-documents/${requestId}/price`, {
    additionalDocumentId,
    unitPrice,
  });
  return res.data;
}
