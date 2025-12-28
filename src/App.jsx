import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicRoutes";
import Login from "./Authentication/SignIn";
import Signup from "./Authentication/SignUp";
import ForgotPassword from "./Authentication/ForgotPassword";
import ResetPassword from "./Authentication/ResetPassword";
import VerifyEmail from "./Authentication/VerifyEmail";
import AuthCallback from "./Pages/AuthCallback";
function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH ROUTES */}
          <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/*" element={<PublicRoutes />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

      </Routes>
    </Router>
  );
}

export default App;