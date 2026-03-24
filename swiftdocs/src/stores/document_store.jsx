import { create } from "zustand";

import { getAllDocuments } from "../services/document_service";

export const useDocumentStore = create((set, get) => ({
  documents: [],
  pagination: {},
  page: 1,
  loading: false,

  // load documents
  loadDocuments: async (page = 1, filters = {}) => {
    try {
      set({ loading: true });

      const data = await getAllDocuments(page, { search: filters.search });

      set({ documents: data.data, pagination: data.pagination, page });
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      set({ loading: false });
    }
  },

  // reload current page
  reloadDocuments: () => {
    const { page } = get();
    get().loadDocuments(page);
  },
}));
