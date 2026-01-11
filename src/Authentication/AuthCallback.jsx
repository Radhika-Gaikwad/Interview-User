import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socialLogin } from "../Services/authService";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const called = useRef(false);

  useEffect(() => {
    // Only run when user is ready
    if (isLoading || !isAuthenticated || !user) return;

    // Prevent duplicate calls
    if (called.current) return;
    called.current = true;

    const provider = user.sub.split("|")[0];
    const payload = {
      email: user.email,
      name: user.name,
      provider,
      providerId: user.sub,
    };

    setLoading(true);

    socialLogin(payload)
      .then((res) => {
        // ✅ Save token (optional if backend uses HttpOnly cookie)
        if (res?.data?.token) localStorage.setItem("token", res.data.token);

        toast.success("Login successful");
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Social login failed");
        navigate("/login", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-700 font-medium">Logging you in…</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;

