import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { AuthProvider, useAuth } from "./stores/auth_store";
import { StudentProvider } from "./stores/student_provider";

import PublicRoutes from "./routes/public_routes";
import AdminRoutes from "./routes/admin_routes";
import CashierRoutes from "./routes/cashier_routes";
import RmoRoutes from "./routes/rmo_routes";
import { Suspense } from "react";
import AuthLoader from "./components/loaders/AuthLoader";
import PageLoader from "./components/loaders/PageLoader";

function RoleRouter() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (!user) {
    return <PublicRoutes />;
  }

  return (
    <StudentProvider role={user.role}>
      {user.role === "admin" && <AdminRoutes />}
      {user.role === "cashier" && <CashierRoutes />}
      {user.role === "rmo" && <RmoRoutes />}
    </StudentProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RoleRouter />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
