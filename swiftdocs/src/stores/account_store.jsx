import { create } from "zustand";
import socket from "../sockets/socket";

import { getAllAccounts, getUserStats } from "../services/account_service";

export const useAccountStore = create((set, get) => ({
  accounts: [],
  pagination: {},
  stats: {},
  page: 1,
  loading: false,
  analyticsLoading: false,

  // load accounts (with pagination)
  loadAccounts: async (page = 1) => {
    try {
      set({ loading: true });

      const data = await getAllAccounts(page);

      set({
        accounts: data.data,
        pagination: data.pagination,
        page,
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
    const { page } = get();
    get().loadAccounts(page);
  },

  // reload analytics
  reloadAnalytics: () => {
    get().loadAnalytics();
  },
}));
