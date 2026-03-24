import socket from "./socket";

import { useRequestStore } from "../stores/request_store";
import { useAccountStore } from "../stores/account_store";
import { useDocumentStore } from "../stores/document_store";
import { useProfileStore } from "../stores/profile_store";

let initialized = false;

export function initSockets() {
  if (initialized) return;

  if (!socket.connected) {
    socket.connect();
  }

  // REQUESTS
  socket.off("requestsUpdated");
  socket.on("requestsUpdated", () => {
    console.log("Requests updated via socket");
    useRequestStore.getState().reloadRequests();
    useRequestStore.getState().reloadAnalytics();
  });

  // ACCOUNTS
  socket.off("accountsUpdated");
  socket.on("accountsUpdated", ({ id }) => {
    console.log("Accounts updated via socket", id);

    const { reloadAccounts, reloadAnalytics } = useAccountStore.getState();
    const { profileId, reloadProfile } = useProfileStore.getState();

    reloadAccounts();
    reloadAnalytics();

    if (profileId === id) {
      reloadProfile();
    }
  });

  // DOCUMENTS
  socket.off("documentsUpdated");
  socket.on("documentsUpdated", () => {
    console.log("Documents updated via socket");
    useDocumentStore.getState().reloadDocuments();
    useDocumentStore.getState().reloadAnalytics();
  });

  initialized = true;
}
