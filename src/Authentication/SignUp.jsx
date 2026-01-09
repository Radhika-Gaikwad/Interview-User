import React, { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedinIn, FaMicrosoft } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import signupImg from "../assets/2.png";
import { useNavigate } from "react-router-dom";
import { signupUser, socialLogin } from "../Services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import SocialAuthLoader from "../Components/SocialAuthLoader";


const GoogleIcon = (
  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border shadow">
    <FcGoogle size={22} />
  </div>
);

const GithubIcon = (
  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black text-white shadow">
    <FaGithub size={20} />
  </div>
);

const LinkedInIcon = (
  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0A66C2] text-white shadow">
    <FaLinkedinIn size={20} />
  </div>
);

const MicrosoftIcon = (
  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border shadow">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      alt="Microsoft"
      className="w-6"
    />
  </div>
);

const SignUp = () => {

  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth0();
  const navigate = useNavigate();
  const hasCalledSocialLogin = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authProvider, setAuthProvider] = useState(null);
  const [showSocialLoader, setShowSocialLoader] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await signupUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store returned token (dev-friendly) so client can use it immediately
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      // Navigate to home
      navigate("/home", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    setShowGoogleLoader(true);

    await loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        scope: "openid profile email",
      },
    });
  };


  const handleSocialLogin = async (connection) => {
    setAuthProvider(connection);
    setShowSocialLoader(true);

    await loginWithRedirect({
      authorizationParams: {
        connection,
        scope: "openid profile email",
      },
    });
  };

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (hasCalledSocialLogin.current) return;

    hasCalledSocialLogin.current = true;

    socialLogin({
      email: user.email,
      name: user.name,
      provider: user.sub.split("|")[0],
      providerId: user.sub,
    })
      .then((res) => {
        // Backend sets HttpOnly cookie; do not store token client-side
        toast.success("Login successful");

        setShowSocialLoader(false);
        setAuthProvider(null);

        navigate("/home", { replace: true });
      })
      .catch((err) => {
        hasCalledSocialLogin.current = false;

        setShowSocialLoader(false);
        setAuthProvider(null);

        toast.error(err.response?.data?.message || "Social login failed");
      });
  }, [isAuthenticated, isLoading, user]);



  return (
    <>
      {showSocialLoader && authProvider === "google-oauth2" && (
        <SocialAuthLoader text="Signing you in with Google…">
          {GoogleIcon}
        </SocialAuthLoader>
      )}

      {showSocialLoader && authProvider === "github" && (
        <SocialAuthLoader text="Signing you in with GitHub…">
          {GithubIcon}
        </SocialAuthLoader>
      )}

      {showSocialLoader && authProvider === "linkedin" && (
        <SocialAuthLoader text="Signing you in with LinkedIn…">
          {LinkedInIcon}
        </SocialAuthLoader>
      )}

      {showSocialLoader && authProvider === "windowslive" && (
        <SocialAuthLoader text="Signing you in with Microsoft…">
          {MicrosoftIcon}
        </SocialAuthLoader>
      )}



      <div className="relative min-h-screen theme-bg flex items-center justify-center overflow-hidden">

        {/* Animated Floating Blobs */}
        <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl animate-blob -top-20 -left-20"></div>
        <div className="absolute w-[500px] h-[500px] bg-white/10  blur-3xl animate-blob animation-delay-2000 -bottom-20 -right-10"></div>

        <div
          className="
          w-[100%] h-full max-h-[1000px]
          grid lg:grid-cols-[0.53fr_0.47fr] 
          shadow-2xl overflow-hidden glass
        "
        >

          {/* Left Side Image */}
          <div className="hidden lg:flex items-center justify-center bg-black/20 backdrop-blur-xl w-full">
            <img
              src={signupImg}
              alt="Signup"
              className="w-full h-full object-fill opacity-90"
            />
          </div>

          {/* Right Panel */}
          <div className="flex flex-col justify-start lg:px-20 py-5 px-5 glass overflow-y-auto">

            {/* Logo */}
            <div className="mb-5 text-center mt-3">
              <h1 className="text-4xl font-extrabold tracking-tight theme-text drop-shadow-sm">
                Intervue
              </h1>

              <p className="text-gray-700 mt-2 text-base font-medium italic">
                AI-Powered Interview Practice
              </p>

              <p className="text-indigo-700 font-semibold mt-1 text-sm tracking-wide">
                Create your free account 🚀
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6 lg:px-6" onSubmit={handleSignup}>

              {/* Name */}
              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border 
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border 
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-base font-semibold text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border 
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-base font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border 
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {/* Role */}
              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                >
                  <option>Select role</option>
                  <option>Student</option>
                  <option>Job Seeker</option>
                  <option>Working Professional</option>
                  <option>HR / Recruiter</option>
                </select>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-base font-semibold text-gray-700">
                  Upload Resume (optional)
                </label>
                <input
                  type="file"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border
                border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full theme-primary 
                py-3 text-lg rounded-xl shadow-xl hover:scale-[1.03] 
                active:scale-95 transition font-semibold"
              >
                Create Account
              </button>
            </form>

            {/* Login redirect */}
            <p className="text-center text-gray-700 text-base mt-3">
              Already have an account?{" "}
              <span
                className="text-indigo-700 font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-600 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex justify-center gap-6">

              <button onClick={() => handleSocialLogin("google-oauth2")}>
                {GoogleIcon}
              </button>

              <button onClick={() => handleSocialLogin("github")}>
                {GithubIcon}
              </button>

              <button onClick={() => handleSocialLogin("linkedin")}>
                {LinkedInIcon}
              </button>

              <button onClick={() => handleSocialLogin("windowslive")}>
                {MicrosoftIcon}
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;