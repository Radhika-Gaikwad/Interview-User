import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicRoutes";
import Login from "./Authentication/SignIn";
import Signup from "./Authentication/SignUp";
import ForgotPassword from "./Authentication/ForgotPassword";
import ResetPassword from "./Authentication/ResetPassword";
import VerifyEmail from "./Authentication/VerifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Default Route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;