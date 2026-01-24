import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axiosInstance";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("verifying");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session_id = params.get("session_id");

    if (!session_id) {
      setStatus("missing");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.post("/users/verify-checkout", { session_id });

        if (res.data?.ok) {
          setStatus("paid");
          // navigate to /home and instruct Home to highlight step 3
          setTimeout(() => navigate("/home", {
  state: {
   completedSteps: [0, 1, 2],
    ctaStep: 3  
  }
}), 3000);
        } else {
          setStatus("unpaid");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <AnimatePresence mode="wait">

          {/* VERIFYING */}
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mx-auto mb-6 h-14 w-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <h2 className="text-xl font-semibold text-gray-800">
                Verifying your payment
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Please wait while we securely confirm your transaction.
              </p>
            </motion.div>
          )}

          {/* SUCCESS */}
          {status === "paid" && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              >
                <span className="text-3xl">✅</span>
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mt-2">
                Your interview credits have been added successfully.
              </p>

              <div className="mt-6 bg-indigo-50 rounded-lg p-4 text-sm text-indigo-700">
                You’re all set to start practicing interviews with AI-powered
                feedback 🚀
              </div>

              <button
               onClick={() =>
  navigate("/home", {
    state: {
      completedSteps: [2],
      ctaStep: 3,
    },
  })
}

                className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </button>

              <p className="mt-3 text-xs text-gray-400">
                Redirecting automatically in a few seconds…
              </p>
            </motion.div>
          )}

          {/* UNPAID / ERROR / MISSING */}
          {(status === "unpaid" || status === "error" || status === "missing") && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <span className="text-3xl">⚠️</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Payment Verification Issue
              </h2>

              <p className="text-gray-600 mt-2 text-sm">
                {status === "missing" &&
                  "Invalid payment session. Please try again."}
                {status === "unpaid" &&
                  "Payment was not completed. If money was deducted, contact support."}
                {status === "error" &&
                  "Something went wrong while verifying your payment."}
              </p>

              <button
                onClick={() => navigate("/pricing")}
                className="mt-6 w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Back to Pricing
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentSuccess;
