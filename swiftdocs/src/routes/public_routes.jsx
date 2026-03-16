import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Landingpage = lazy(() => import("../layouts/Landingpage"));
const DataPrivacy = lazy (() => import("../layouts/DataPrivacy"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landingpage />} />
      <Route path="/privacy" element={<DataPrivacy/>}/>
    </Routes>
  );
}
