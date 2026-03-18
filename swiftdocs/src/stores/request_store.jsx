import { create } from "zustand";
import socket from "../sockets/socket";

import { fetchAllRequests } from "../services/request_service";
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
        stats: data.stats,
        page,
      });
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      set({ loading: false });
    }
  },

  reloadRequests: () => {
    const { page } = get();
    get().loadRequests(page);
  },

  initSocket: () => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.off("requestsUpdated");

    socket.on("requestsUpdated", () => {
      get().reloadRequests();
    });
  },
}));
