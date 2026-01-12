import { Navigate, Outlet } from "react-router-dom";

function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    const decoded = JSON.parse(atob(base64));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const PublicOnlyRoute = () => {
  const token = localStorage.getItem("token");


  if (isTokenValid(token)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />; // ✅ REQUIRED
};

export default PublicOnlyRoute;
