import React, { useState } from "react";
import { forgotPassword } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  try {
    setLoading(true);

    const res = await forgotPassword({ email });

    console.log("Forgot password response:", res);

    if (res?.message) {
      toast.success(res.message || "OTP sent to email");

      // navigate after success
      navigate("/reset-password", {
        state: { email },
        replace: true
      });
    }

  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your email to receive a password reset OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <FiMail className="absolute top-4 left-3 text-gray-400" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full theme-primary py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

        <p
          className="text-center text-sm text-indigo-600 mt-6 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Back to login
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;