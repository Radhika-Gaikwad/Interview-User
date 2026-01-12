import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

import PublicRoutes from "./routes/publicRoutes";
import AuthCallback from "./Authentication/AuthCallback";

import Login from "./Authentication/SignIn";
import Signup from "./Authentication/SignUp";
import ForgotPassword from "./Authentication/ForgotPassword";
import ResetPassword from "./Authentication/ResetPassword";
import VerifyEmail from "./Authentication/VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* ROOT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC ONLY ROUTES */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <PublicOnlyRoute>
              <VerifyEmail />
            </PublicOnlyRoute>
          }
        />

        {/* AUTH0 CALLBACK — NEVER WRAPPED */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* PROTECTED APP ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PublicRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

