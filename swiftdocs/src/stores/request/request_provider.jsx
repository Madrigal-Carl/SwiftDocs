import { useState, useEffect } from "react";
import socket from "../../sockets/socket";
import { RequestContext } from "./request_context";

import { fetchAllRequests } from "../../services/request_service";
import { fetchCashierRequests } from "../../services/cashier_service";

export function RequestProvider({ children, role }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const requestFetchers = {
    admin: fetchAllRequests,
    rmo: fetchAllRequests,
    cashier: fetchCashierRequests,
  };

  const loadRequests = async () => {
    try {
      if (!role) return;

      setLoading(true);

      const fetcher = requestFetchers[role];
      if (!fetcher) return;

      const data = await fetcher();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!role) return;

    if (!socket.connected) {
      socket.connect();
    }

    loadRequests();

    const handleUpdate = async () => {
      await loadRequests();
    };

    socket.on("requestsUpdated", handleUpdate);

    return () => {
      socket.off("requestsUpdated", handleUpdate);
    };
  }, [role]);

  return (
    <RequestContext.Provider
      value={{
        requests,
        loading,
        reloadRequests: loadRequests,
        setRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}
