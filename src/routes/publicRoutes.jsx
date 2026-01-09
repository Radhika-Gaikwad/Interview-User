import { Routes, Route } from "react-router-dom";
import Layout from "../Components/Layout";

import Home from "../Pages/user/Home";
import Interview from "../Pages/user/Interview";
import Resume from "../Pages/user/Resume";
import Support from "../Pages/user/Support";
import Profile from "../Pages/user/Profile";
import Download from "../Pages/user/Download";
import InterviewCredits from "../Pages/user/InterviewCredits";
import PaymentSuccess from "../Pages/payment/PaymentSuccess";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/download" element={<Download />} />
        <Route path="/buy-credits" element={<InterviewCredits />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>
    </Routes>
  );
}
