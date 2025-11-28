import { Routes, Route } from "react-router-dom";
import Layout from "../Components/Layout";

import Home from "../Pages/user/Home";
import Interview from "../Pages/user/Interview";
import Resume from "../Pages/user/Resume";
import Support from "../Pages/user/Support";
import Profile from "../Pages/user/Profile";
import Download from "../Pages/user/Download";

export default function PublicRoutes() {
  return (
    <Routes>
      {/* Layout Wrapper */}
      <Route element={<Layout />}>
        {/* Home Page */}
        <Route path="/home" element={<Home />} />

        {/* Other Pages */}
        <Route path="/interview" element={<Interview />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/download" element={<Download />} />
      </Route>
    </Routes>
  );
}