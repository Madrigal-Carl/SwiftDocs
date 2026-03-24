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
export async function getAllDocuments(page = 1, filters = {}) {
  const res = await api.get("/documents", {
    params: {
      page,
      limit: 10,
      search: filters.search || "",
    },
  });
  return res.data;
}

// fetch all documents (no pagination)
export async function getAllDocumentsNoPagination() {
  const res = await api.get("/documents/all");
  return res.data;
}

// fetch document analytics
export async function getDocumentAnalytics() {
  const res = await api.get("/documents/analytics");
  return res.data;
}
