import { create } from "zustand";
import socket from "../sockets/socket";

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
  loading: false,
  role: null,

  setRole: (role) => {
    set({
      role,
      requests: [],
      pagination: {},
      page: 1,
    });

    if (role) {
      get().loadRequests();
      get().loadAnalytics();
    }
  },

  loadRequests: async (page = 1) => {
    try {
      const { role } = get();
      if (!role) return;

      const fetcher = requestFetchers[role];
      if (!fetcher) {
        console.warn("No fetcher for role:", role);
        return;
      }

      set({ loading: true });

      const data = await fetcher(page);

      set({
        requests: data.data,
        pagination: data.pagination,
        page,
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
    const { page } = get();
    get().loadRequests(page);
  },

  reloadAnalytics: () => {
    get().loadAnalytics();
  },

  initSocket: () => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.off("requestsUpdated");

    socket.on("requestsUpdated", () => {
      get().reloadRequests();
      get().reloadAnalytics();
    });
  },
}));
