import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const CashierDashboard = lazy(
  () => import("../pages/Cashier/CashierDashboard"),
);

export default function CashierRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CashierDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
