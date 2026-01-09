import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const json = atob(base64);
    const decoded = JSON.parse(json);
    return typeof decoded.exp === "number" && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const token = localStorage.getItem("token");
  const hasValidToken = isTokenValid(token);

  if (isLoading) return null;

  if (token && !hasValidToken) {
    localStorage.removeItem("token");
  }

  if (isAuthenticated || hasValidToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
