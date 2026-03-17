import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const CashierDashboard = lazy(
  () => import("../layouts/Cashier/CashierDashboard"),
);

export default function CashierRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CashierDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
