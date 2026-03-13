import { useState, useEffect } from "react";
import socket from "../../sockets/socket";
import { RequestContext } from "./request_context";

import { fetchAllRequests } from "../../services/request_service";
import { fetchCashierRequests } from "../../services/cashier_service";

export function RequestProvider({ children, role }) {
  const [requests, setRequests] = useState({ all: [], cashier: [] });

  const loadRequests = async () => {
    try {
      if (role === "admin" || role === "rmo") {
        const data = await fetchAllRequests();
        setRequests((prev) => ({ ...prev, all: data }));
      }

      if (role === "cashier") {
        const data = await fetchCashierRequests();
        setRequests((prev) => ({ ...prev, cashier: data }));
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
  };

  useEffect(() => {
    if (!role) return;

    loadRequests();

    const handleUpdate = async () => {
      await loadRequests();
    };

    socket.on("requestsUpdated", handleUpdate);

    return () => socket.off("requestsUpdated", handleUpdate);
  }, [role]);

  return (
    <RequestContext.Provider
      value={{ requests, setRequests, reloadRequests: loadRequests }}
    >
      {children}
    </RequestContext.Provider>
  );
}
