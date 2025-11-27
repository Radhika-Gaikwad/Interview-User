import { Routes, Route } from "react-router-dom";

import Signup from "../Authentication/SignUp";
import VerifyEmail from "../Authentication/VerifyEmail";
import Signin from "../Authentication/SignIn";
import ForgotPassword from "../Authentication/ForgotPassword";
import ResetPassword from "../Authentication/ResetPassword";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}
