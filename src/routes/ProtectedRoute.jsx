import { Navigate, Outlet } from "react-router-dom";

function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

