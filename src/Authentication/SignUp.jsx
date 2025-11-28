import React, { useState } from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import signupImg from "../assets/2.png";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform signup logic here (e.g., API call)
    // On success, navigate to the login page
    navigate("/login");
  };


  return (
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
                type={showPassword ? "text" : "password"}
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
                type={showConfirmPassword ? "text" : "password"}
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

          {/* Social Buttons */}
          <div className="flex justify-center gap-6">
            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-[#1877F2] text-white shadow-lg hover:scale-110 transition">
              <FaFacebookF size={18} />
            </button>

            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-white border shadow-lg hover:scale-110 transition">
              <FcGoogle size={20} />
            </button>

            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-[#0A66C2] text-white shadow-lg hover:scale-110 transition">
              <FaLinkedinIn size={18} />
            </button>

            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-white border shadow-lg hover:scale-110 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="MS"
                className="w-6"
              />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
