import { create } from "zustand";

import { getAllAccounts, getUserStats } from "../services/account_service";

export const useAccountStore = create((set, get) => ({
  accounts: [],
  pagination: {},
  stats: {},
  page: 1,
  filters: {},
  loading: false,
  analyticsLoading: false,

  // load accounts (with pagination)

  loadAccounts: async (page = 1, filters = null) => {
    try {
      set({ loading: true });

      const currentFilters = filters ?? get().filters;

      const data = await getAllAccounts(page, currentFilters);

      set({
        accounts: data.data,
        pagination: data.pagination,
        page,
        filters: currentFilters,
      });
    } catch (err) {
      console.error("Failed to load accounts:", err);
    } finally {
      set({ loading: false });
    }
  },

  // load analytics
  loadAnalytics: async () => {
    try {
      set({ analyticsLoading: true });

      const stats = await getUserStats();

      set({ stats });
    } catch (err) {
      console.error("Failed to load account analytics:", err);
    } finally {
      set({ analyticsLoading: false });
    }
  },

  // reload current page
  reloadAccounts: () => {
    const { page, filters } = get();
    get().loadAccounts(page, filters);
  },

  // reload analytics
  reloadAnalytics: () => {
    get().loadAnalytics();
  },
}));
