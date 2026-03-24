import socket from "./socket";

import { useRequestStore } from "../stores/request_store";
import { useAccountStore } from "../stores/account_store";
import { useDocumentStore } from "../stores/document_store";
<<<<<<< HEAD
import { authRef } from "../stores/auth_store";
=======
>>>>>>> 35b68b7188ccacc4dcbd1607304b247e79aa1c14

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
  socket.on("accountsUpdated", (payload) => {
    console.log("Accounts updated via socket", payload);

    const { id } = payload || {};

    useAccountStore.getState().reloadAccounts();
    useAccountStore.getState().reloadAnalytics();

    const currentUser = authRef.getUser();

    if (currentUser && currentUser.id === id) {
      authRef.reloadUser();
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
