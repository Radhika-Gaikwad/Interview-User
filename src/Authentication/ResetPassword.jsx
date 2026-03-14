import React, { useState, useEffect, useRef } from "react";
import { resetPassword, forgotPassword } from "../Services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email]);

  /* ---------------- OTP STATE ---------------- */

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);

  /* ---------------- PASSWORD STATE ---------------- */

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /* ---------------- TIMER ---------------- */

  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /* ---------------- RESET ALL FIELDS ---------------- */

  const resetFields = () => {

    setOtp(new Array(6).fill(""));
    setNewPassword("");
    setConfirmPassword("");

    otpRefs.current.forEach((input) => {
      if (input) input.value = "";
    });

    otpRefs.current[0]?.focus();
  };

  /* ---------------- OTP INPUT ---------------- */

  const handleOtpChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace") {

      if (otp[index] === "" && index > 0) {
        otpRefs.current[index - 1].focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";

      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {

    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const pasteArray = paste.split("");

    const newOtp = [...otp];

    pasteArray.forEach((num, idx) => {
      newOtp[idx] = num;

      if (otpRefs.current[idx]) {
        otpRefs.current[idx].value = num;
      }
    });

    setOtp(newOtp);
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOtp = async () => {

    try {

      setResendLoading(true);

      await forgotPassword({ email });

      toast.success("OTP resent successfully");

      resetFields();

      setTimer(120);

    } catch (err) {

      toast.error(err?.response?.data?.message || "Failed to resend OTP");

    } finally {

      setResendLoading(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter 6 digit OTP");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await resetPassword({
        email,
        otp: finalOtp,
        newPassword,
        confirmPassword,
      });

      toast.success("Password reset successfully");

      navigate("/login");

    } catch (err) {

      toast.error(err?.response?.data?.message || "Reset failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center theme-bg px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter the 6 digit code sent to
          <br />
          <span className="font-semibold text-indigo-600">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP INPUT */}

          <div className="flex justify-between gap-2" onPaste={handlePaste}>

            {otp.map((digit, index) => (

              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-150 focus:scale-105"
              />

            ))}

          </div>

          {/* NEW PASSWORD */}

          <div className="relative">

            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            />

            <span
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            />

            <span
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full theme-primary py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {/* TIMER */}

        <div className="text-center mt-6">

          {resendLoading ? (

            <p className="text-gray-600 text-sm">
              Sending OTP...
            </p>

          ) : timer > 0 ? (

            <p className="text-gray-700 text-sm">
              Resend OTP in {formatTime()}
            </p>

          ) : (

            <button
              onClick={resendOtp}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>

          )}

        </div>

      </div>

    </div>

  );
};

export default ResetPassword;