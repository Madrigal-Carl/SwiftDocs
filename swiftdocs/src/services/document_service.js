import api from "../api/api";

// create document
export async function createDocument(data) {
  const res = await api.post("/documents", data);
  return res.data;
}

// update document
export async function updateDocument(id, data) {
  const res = await api.patch(`/documents/${id}`, data);
  return res.data;
}

// delete document (soft delete)
export async function deleteDocument(id) {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
}