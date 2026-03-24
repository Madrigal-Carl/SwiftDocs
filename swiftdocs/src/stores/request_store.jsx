import { create } from "zustand";

import {
  fetchAllRequests,
  fetchRequestAnalytics,
} from "../services/request_service";
import { fetchCashierRequests } from "../services/cashier_service";

const requestFetchers = {
  admin: fetchAllRequests,
  rmo: fetchAllRequests,
  cashier: fetchCashierRequests,
};

export const useRequestStore = create((set, get) => ({
  requests: [],
  pagination: {},
  stats: {},
  page: 1,
  filters: {},
  loading: false,
  analyticsLoading: false,
  role: null,

  setRole: (role) => {
    set({
      role,
      requests: [],
      pagination: {},
      page: 1,
      filters: {},
    });

    if (role) {
      get().loadRequests();
      get().loadAnalytics();
    }
  },

  loadRequests: async (page = 1, filters = null) => {
    try {
      const { role } = get();
      if (!role) return;

      const fetcher = requestFetchers[role];
      if (!fetcher) {
        console.warn("No fetcher for role:", role);
        return;
      }

      set({ loading: true });

      const currentFilters = filters ?? get().filters;

      const data = await fetcher(page, 10, currentFilters);

      set({
        requests: data.data,
        pagination: data.pagination,
        page,
        filters: currentFilters,
      });
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      set({ loading: false });
    }
  },

  loadAnalytics: async () => {
    try {
      set({ analyticsLoading: true });

      const stats = await fetchRequestAnalytics();

      set({ stats });
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      set({ analyticsLoading: false });
    }
  },

  reloadRequests: () => {
    const { page, filters } = get();
    get().loadRequests(page, filters);
  },

  reloadAnalytics: () => {
    get().loadAnalytics();
  },
}));
