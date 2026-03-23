import { useEffect, useRef, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider, useAuth } from "./stores/auth_store";
import { useRequestStore } from "./stores/request_store";
import { useAccountStore } from "./stores/account_store";

import PublicRoutes from "./routes/public_routes";
import AdminRoutes from "./routes/admin_routes";
import CashierRoutes from "./routes/cashier_routes";
import RmoRoutes from "./routes/rmo_routes";

import Loader from "./components/Loader";

function RoleRouter() {
  const { user, loading } = useAuth();
  const setRole = useRequestStore((state) => state.setRole);
  const initSocket = useRequestStore((state) => state.initSocket);

  const loadAccounts = useAccountStore((s) => s.loadAccounts);
  const loadAnalytics = useAccountStore((s) => s.loadAnalytics);

  const initialized = useRef(false);

  useEffect(() => {
    if (user?.role && !initialized.current) {
      setRole(user.role);
      initSocket();

      if (user.role === "admin") {
        loadAccounts(1);
        loadAnalytics();
      }

      initialized.current = true;
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRole(null);
      initialized.current = false;
    }
  }, [user]);

  if (loading) return <Loader />;

  if (!user) {
    return <PublicRoutes />;
  }

  return (
    <Suspense fallback={<Loader />}>
      {user.role === "admin" && <AdminRoutes />}
      {user.role === "cashier" && <CashierRoutes />}
      {user.role === "rmo" && <RmoRoutes />}
    </Suspense>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RoleRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
