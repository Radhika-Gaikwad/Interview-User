import api from "../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

// Always prefer env key (required in production)
// const STRIPE_PUBLIC_KEY =
//   import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
//   "pk_test_51SlkJKFi1RNkgJ5fp5beBrAGrXzzJ05SunpipgcyhCPpflnnqXDCcsSxFVpWfYinq1Km2ltQ6WYrylPgzO26JAXO001Lu7GHcP";

// let stripePromise;
// const getStripe = () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
//   }
//   return stripePromise;
// };

export const buyCredits = async (plan) => {
  const res = await api.post("/users/buy-credits", { plan });

  const checkoutUrl = res.data?.url;
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned from server");
  }

  // ✅ Stripe 2025+ way
  window.location.href = checkoutUrl;
};