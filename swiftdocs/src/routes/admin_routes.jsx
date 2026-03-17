import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("../layouts/Admin/AdminDashboard"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
