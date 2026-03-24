import { create } from "zustand";
import { getAllDocuments } from "../services/document_service";

export const useDocumentStore = create((set, get) => ({
  documents: [],
  pagination: {},
  page: 1,
  loading: false,
  filters: {},

  loadDocuments: async (page = 1, filters = null) => {
    try {
      set({ loading: true });

      const currentFilters = filters ?? get().filters;

      const data = await getAllDocuments(page, {
        search: currentFilters.search,
      });

      set({
        documents: data.data,
        pagination: data.pagination,
        page,
        filters: currentFilters,
      });
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      set({ loading: false });
    }
  },

  reloadDocuments: () => {
    const { page, filters } = get();
    get().loadDocuments(page, filters);
  },
}));
