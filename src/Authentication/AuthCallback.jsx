import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socialLogin } from "../Services/authService";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (called.current) return;

    called.current = true;

    socialLogin({
      email: user.email,
      name: user.name,
      provider: user.sub.split("|")[0],
      providerId: user.sub,
    })
      .then((res) => {
    
        toast.success("Login successful");
        navigate("/home", { replace: true });
      })
      .catch(() => {
        toast.error("Social login failed");
        navigate("/login", { replace: true });
      });
  }, [isAuthenticated, isLoading, user]);

  // Render nothing — navigation happens programmatically after social login
  return null;
};

export default AuthCallback;
