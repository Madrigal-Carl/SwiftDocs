import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Landingpage = lazy(() => import("../pages/Landingpage"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landingpage />} />
    </Routes>
  );
}
