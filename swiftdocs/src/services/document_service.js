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

// fetch all documents
export async function getAllDocuments(includeDeleted = false) {
  const res = await api.get("/documents", {
    params: { includeDeleted }, // adds ?includeDeleted=true if needed
  });
  return res.data;
}