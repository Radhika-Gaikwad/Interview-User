import { motion } from "framer-motion";
import { X } from "lucide-react";

const ConfirmPlanModal = ({ plan, onConfirm, onClose }) => {
  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose} // 👈 overlay click closes
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()} // 👈 prevent close inside
        className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold">Confirm your plan</h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Credits</span>
            <span className="font-semibold">{plan.credits}</span>
          </div>

          {plan.free > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Free credits</span>
              <span>+{plan.free}</span>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{plan.priceINR}</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          ✔ 30-day money-back guarantee<br />
          ✔ Credits never expire
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 theme-primary rounded-lg py-2 font-semibold"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmPlanModal;
