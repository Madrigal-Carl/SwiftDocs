import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const RmoDashboard = lazy(() => import("../pages/RMO/RmoDashboard"));

export default function RmoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RmoDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
