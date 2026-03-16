import api from "../api/api";

export async function updateRmoRequestStatus(id, status) {
  const res = await api.patch(`/rmo/requests/${id}/status`, {
    status,
  });
  return res.data;
}

export async function setAdditionalDocumentPrice(requestId, additionalDocumentId, unitPrice) {
  const res = await api.patch(`/rmo/additional-documents/${requestId}/price`, {
    additionalDocumentId,
    unitPrice,
  });
  return res.data;
}