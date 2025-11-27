import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/user/Dashboard";

export default function UserRoutes() {
  return (
    <Routes>
      {/* 8. User Portal Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
