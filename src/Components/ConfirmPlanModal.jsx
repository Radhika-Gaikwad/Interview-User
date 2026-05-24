import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  CreditCard,
  Gift,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

const ConfirmPlanModal = ({ plan, onConfirm, onClose }) => {
  if (!plan) return null;

  const totalCredits = Number(plan.credits || 0) + Number(plan.free || 0);
  const hasFreeCredits = Number(plan.free || 0) > 0;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm "
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg  rounded-2xl bg-white shadow-2xl h-full overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-plan-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-400 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close confirm plan modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 pb-6 pt-7">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--color-brand-subtle)] blur-2xl" />
          <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-sky-100 blur-2xl" />

          <div className="relative pr-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-sm">
                {hasFreeCredits ? (
                  <Gift className="h-6 w-6" />
                ) : (
                  <Coins className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  One-time payment
                </p>

                <h2
                  id="confirm-plan-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  Confirm your plan
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {plan.title || plan.name || "Selected Plan"}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {totalCredits} interview credit
                    {totalCredits > 1 ? "s" : ""} included
                  </p>
                </div>

                {plan.popular && (
                  <span className="rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  ₹{plan.priceINR}
                </span>

                {plan.priceUSD && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {plan.priceUSD}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-3 rounded-2xl border border-[var(--session-border)] bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-slate-500">
                <CreditCard className="h-4 w-4 text-slate-400" />
                Base Credits
              </span>

              <span className="font-bold text-slate-900">
                {plan.credits || 0}
              </span>
            </div>

            {hasFreeCredits && (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-emerald-600">
                  <Gift className="h-4 w-4" />
                  Free Credits
                </span>

                <span className="font-bold text-emerald-600">
                  +{plan.free}
                </span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-900">
                  Total Credits
                </span>

                <span className="font-bold text-slate-900">
                  {totalCredits}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-900">
                  Payable Amount
                </span>

                <span className="text-lg font-bold text-brand">
                  ₹{plan.priceINR}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-subtle)] px-3 py-2 text-xs font-semibold text-[var(--color-brand-hover)]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>30-day money-back guarantee</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-subtle)] px-3 py-2 text-xs font-semibold text-[var(--color-brand-hover)]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Credits never expire</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-subtle)] px-3 py-2 text-xs font-semibold text-[var(--color-brand-hover)]">
              <Tag className="h-4 w-4 shrink-0" />
              <span>1 credit = 1 interview session</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-[var(--session-border)] bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-[var(--color-brand)] hover:text-brand"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--color-brand-hover)]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmPlanModal;