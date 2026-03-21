import React, { useState } from "react";
import {  AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Coins, CreditCard } from "lucide-react";
import { buyCredits } from "../../Services/paymentService";
import PreStripeModal from "../../Components/PreStripeModal";
import ConfirmPlanModal from "../../Components/ConfirmPlanModal";

const plansRow1 = [
  {
    id: "basic",
    title: "Basic",
    priceINR: "2,650",
    priceUSD: "$29.50",
    credits: 3,
    free: 0,
    dots: { rows: 1, cols: 3, yellow: 0 },
    cta: "Buy credit",
  },
  {
    id: "plus",
    title: "Plus",
    priceINR: "5,300",
    priceUSD: "$59.00",
    credits: 6,
    free: 2,
    dots: { rows: 2, cols: 3, yellow: 2 },
    cta: "Buy credit",
  },
  {
    id: "advanced",
    title: "Advanced",
    priceINR: "7,950",
    priceUSD: "$88.50",
    credits: 9,
    free: 6,
    dots: { rows: 3, cols: 3, yellow: 6 },
    cta: "Buy credit",
  },
];

// second row - custom plans (you said make your own plans)
const plansRow2 = [
  {
    id: "starter",
    title: "Starter",
    priceINR: "1,450",
    priceUSD: "$16.00",
    credits: 1,
    free: 0,
    dots: { rows: 1, cols: 1, yellow: 0 },
    cta: "Buy Credit",
  },
  {
    id: "pro",
    title: "Pro",
    priceINR: "10,900",
    priceUSD: "$121.50",
    credits: 12,
    free: 6,
    dots: { rows: 4, cols: 3, yellow: 6 },
    cta: "Buy Credit",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    priceINR: "19,500",
    priceUSD: "$217.00",
    credits: 20,
    free: 10,
    dots: { rows: 5, cols: 4, yellow: 10 },
    cta: "Contact",
  },
];

const OfferBar = () => {
  return (
    <div className="w-full">
      <div
        className="w-full max-w-full rounded-b-2xl py-3 px-4 md:px-6 text-center shadow-lg"
        style={{ background: "linear-gradient(90deg, #fff7ed, #fff3e0)" }}
      >
        <div className="inline-flex items-center gap-4">
          <span className="text-sm md:text-base font-medium text-orange-600">🔥</span>
          <span className="text-sm md:text-base">Special offer for</span>
          <span className="text-sm md:text-base font-extrabold italic text-orange-800">IN India</span>
          <span className="text-sm md:text-base">users: Use code</span>
          <span className="px-2 py-1 rounded-md font-semibold text-white bg-orange-500 tracking-wider">
            INDIA25
          </span>
          <span className="text-sm md:text-base font-semibold text-orange-700">for 25% off!</span>
        </div>
      </div>
    </div>
  );
};

const DotGrid = ({ rows = 1, cols = 3, yellow = 0 }) => {
  const total = rows * cols;
  const dots = Array.from({ length: total }).map((_, i) => ({ idx: i }));

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {dots.map((d, i) => {
        const isYellow = i < yellow;
        return (
          <div
            key={i}
            className={`w-[10px] h-[10px] rounded-full ${isYellow ? "bg-yellow-400" : "bg-gray-800"}`}
          />
        );
      })}
    </div>
  );
};

const PlanCard = ({ plan, isSelected, onSelect, onBuy }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(plan.id)}
      className={`relative cursor-pointer p-5 rounded-2xl border-2
    flex flex-col h-full
    ${isSelected ? "ring-4 ring-indigo-200 bg-white/80" : "hover-faint-gradient"}
  `}
    >

      {/* Top content */}
      <div className="flex items-start gap-4">
        {/* <div className="flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center bg-indigo-50 rounded-full">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
          </div>
        </div> */}

        <div className="flex-1">
          {/* Title + Price */}
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-gray-900">{plan.title}</h4>

            <div className="text-right">
              <div className="text-base text-gray-800">₹{plan.priceINR}</div>
              <div className="text-sm text-gray-700">({plan.priceUSD})</div>
            </div>
          </div>

          {/* Dot grid + credits */}
          <div className="mt-3 flex items-center justify-between">
            {/* LEFT — ALWAYS Left aligned dots */}
            <div className="w-16 scale-[0.7]">
              <DotGrid
                rows={plan.dots.rows}
                cols={plan.dots.cols}
                yellow={plan.dots.yellow}
              />
            </div>

            {/* RIGHT — Interview credits */}
            <div className="text-sm text-gray-800 text-right">
              <span className="font-semibold text-indigo-600">{plan.credits}</span>
              <span className="ml-1"> Interview Credit{plan.credits > 1 ? "s" : ""}</span>

              {plan.free > 0 && (
                <div className="text-sm text-yellow-700 font-semibold">
                  + {plan.free} Free
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {plan.credits} credits • One-time
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuy(plan);
          }}
          className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition shadow-md
      ${isSelected
              ? "bg-white text-indigo-700 border border-indigo-200"
              : "theme-primary"}
    `}
        >
          {plan.cta} →
        </button>
      </div>

    </motion.div>
  );
};


const InfoPlate = () => {
  return (
    <div className="mt-6 p-4 rounded-xl glass flex items-center justify-between gap-4 border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🔁</div>
          <div>
            <div className="text-sm font-semibold">30-Day Money Back</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">⏳</div>
          <div className="text-sm">Credits Never Expire</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🪙</div>
          <div className="text-sm">1 Credit = 1h Interview</div>
        </div>
      </div>

      <div className="text-sm text-indigo-700 font-semibold">→</div>
    </div>
  );
};

const InterviewCredits = () => {
  const [activePlan, setActivePlan] = useState(null); // ✅ holds plan object
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStripePrep, setShowStripePrep] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState(null); // visual selection


  return (
    <>
      {showConfirm && activePlan && (
        <ConfirmPlanModal
          plan={activePlan}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            setShowStripePrep(true);
          }}
        />
      )}

      {showStripePrep && activePlan && (
        <PreStripeModal
          plan={activePlan}
          onPay={() => {
            setIsPaying(true);
            buyCredits({
              title: activePlan.title,
              amount: Number(activePlan.priceINR.replace(",", "")),
              credits: activePlan.credits + activePlan.free,
            });
          }}
          onBack={() => {
            setShowStripePrep(false);
            setShowConfirm(true);
          }}
          onClose={() => {
            setShowStripePrep(false);
            setActivePlan(null);
          }}
        />
      )}



      <div className="relative w-full theme-bg ">{/* pt-20 to offset fixed offer bar */}
        <div className="sticky top-0 z-30">
          <OfferBar />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mt-6"
          >
            <div className="text-sm uppercase tracking-wider text-gray-500">PRICING</div>
            <h1 className="text-2xl md:text-4xl font-semibold mt-2">
              <span className="font-semibold">No Subscription</span>
            </h1>
            <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-2">
              <span className="text-lg">🔰</span>
              <span>One-time payment</span>
            </p>
          </motion.div>

          {/* Gray-100 Plate */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 p-4 rounded-xl bg-gray-100 border border-gray-200"
          >
            <div className="max-w-4xl mx-auto w-full">

              <div className="flex flex-col md:flex-row items-center justify-between w-full">

                {/* --- POINTS ROW --- */}
                <div className="flex w-full items-center justify-between">

                  {/* Point 1 */}
                  <div className="flex items-center gap-3 w-full justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">🔁</div>
                    <div className="text-sm">30-Day Money Back</div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-10 bg-gray-300"></div>

                  {/* Point 2 */}
                  <div className="flex items-center gap-3 w-full justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-60">⌚</div>
                    <div className="text-sm">Credits Never Expire</div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-10 bg-gray-300"></div>

                  {/* Point 3 */}
                  <div className="flex items-center gap-3 w-full justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">🪙</div>
                    <div className="text-sm">1 Credit = 1h Interview</div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>


          {/* First Row (3 cards) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansRow1.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                isSelected={selectedPlanId === p.id}
                onSelect={setSelectedPlanId}
                onBuy={(plan) => {
                  setActivePlan(plan);
                  setShowConfirm(true);
                }}
              />
            ))}

          </div>



          {/* Split credits plate */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 p-4 rounded-xl bg-white border border-gray-200 
             flex items-center justify-center min-h-[90px] text-center"
          >
            <div className="flex items-center gap-3 justify-center">

              <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">[|]</div>

              <div className="flex flex-col justify-center">
                <div className="text-sm font-semibold leading-tight">
                  You can split credits into 30-minute sessions.
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  Use one credit for a 60-min interview or split into two 30-min interviews.
                </div>
              </div>

            </div>
          </motion.div>


          {/* Second Row (3 cards) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansRow2.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                isSelected={selectedPlanId === p.id}
                onSelect={setSelectedPlanId}
                onBuy={(plan) => {
                  setActivePlan(plan);
                  setShowConfirm(true);
                }}
              />
            ))}

          </div>

          {/* CTA area */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-8 rounded-xl p-6 glass-card border flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div>
              <div className="text-lg font-semibold">Ready to buy credits?</div>
              <div className="text-sm text-gray-600">
                Selected plan: {selectedPlanId ? selectedPlanId.toUpperCase() : "None"}
              </div>

            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={!selectedPlanId}
                onClick={() => {
                  const plan = [...plansRow1, ...plansRow2].find(
                    (p) => p.id === selectedPlanId
                  );
                  setActivePlan(plan);
                  setShowConfirm(true);
                }}
                className={`px-4 py-2 rounded-lg font-semibold
    ${!selectedPlanId ? "opacity-50 cursor-not-allowed" : "theme-primary"}
  `}
              >
                Buy Selected Plan
              </button>

              <button className="px-4 py-2 rounded-lg border">Contact Support</button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InterviewCredits;
