import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { AuthProvider, useAuth } from "./stores/auth/auth_store";
import { RequestProvider } from "./stores/request/request_provider";

import PublicRoutes from "./routes/public_routes";
import AdminRoutes from "./routes/admin_routes";
import CashierRoutes from "./routes/cashier_routes";
import RmoRoutes from "./routes/rmo_routes";

import { Suspense } from "react";
import Loader from "./components/Loader";

function RoleRouter() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <PublicRoutes />;
  }

  return (
    <RequestProvider role={user.role}>
      <Suspense fallback={<Loader />}>
        {user.role === "admin" && <AdminRoutes />}
        {user.role === "cashier" && <CashierRoutes />}
        {user.role === "rmo" && <RmoRoutes />}
      </Suspense>
    </RequestProvider>
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
