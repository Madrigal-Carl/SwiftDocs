import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Landingpage = lazy(() => import("../pages/Landingpage"));
const Authpage = lazy(() => import("../pages/AuthPage"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Authpage />} />
      <Route path="*" element={<Landingpage />} />
    </Routes>
  );
}
