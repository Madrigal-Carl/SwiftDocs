import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Landingpage = lazy(() => import("../pages/Landingpage"));
const Authpage = lazy(() => import ("../components/AuthPage"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landingpage />} />
      <Route path="/auth" element={<Authpage/>}/>
    </Routes>
  );
}
