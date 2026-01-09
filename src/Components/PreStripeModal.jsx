import { motion } from "framer-motion";
import { CreditCard, Coins, ArrowLeft, X } from "lucide-react";

const PreStripeModal = ({ plan, onPay, onBack, onClose }) => {
  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        {/* Header controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <h2 className="text-xl font-semibold">Almost there 🚀</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-indigo-600" />
            <span>{plan.credits + plan.free} interview credits</span>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Secure Stripe checkout</span>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            You’ll be redirected to Stripe.<br />
            We never store your card details.
          </div>
        </div>

        <button
          onClick={onPay}
          className="mt-6 w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold"
        >
          Pay ₹{plan.priceINR} securely →
        </button>
      </motion.div>
    </div>
  );
};

export default PreStripeModal;
