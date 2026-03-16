import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Landingpage = lazy(() => import("../layouts/Landingpage"));
const DataPrivacy = lazy (() => import("../layouts/DataPrivacy"));
const DocumentSelection = lazy(() => import("../pages/Public/DocumentSelection"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landingpage />} />
      <Route path="/privacy" element={<DataPrivacy/>}/>
      <Route path="/request" element={<DocumentSelection/>}/>
    </Routes>
  );
}
