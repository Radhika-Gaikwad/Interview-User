import React from "react";
import { motion } from "framer-motion";
import WindowsLogo from "../../assets/WindowsLogo.png";
import MacLogo from "../../assets/MacLogo.png";
import LinuxLogo from "../../assets/LinuxLogo.png";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const Download = () => {
  return (
    <div className="min-h-screen w-full theme-bg text-black pb-20">

      {/* HERO SECTION */}
      <section className="pt-5 px-6 md:px-12 text-center relative">

        <motion.h1
          {...fadeUp}
          className="text-2xl md:text-4xl font-extrabold tracking-tight theme-text"
        >
          Download Intervue Desktop App
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-base md:text-base max-w-2xl mx-auto mt-4"
        >
          Supercharge your interview practice with a clean, fast and offline-ready desktop app.
        </motion.p>

        {/* Download Buttons */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10"
        >
          <DownloadButton img={WindowsLogo} label="Windows" />
          <DownloadButton img={MacLogo} label="Mac" />
          <DownloadButton img={LinuxLogo} label="Linux" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mt-8">
        <motion.h2
          {...fadeUp}
          className="text-center text-xl md:text-2xl font-bold theme-text mb-5"
        >
          Powerful Features – Built for You
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            title="⚡ Blazing Fast Performance"
            desc="Runs smoothly even on low-end systems."
          />
          <FeatureCard
            title="💡 Smart AI Assistance"
            desc="Ask AI, get suggestions, improve instantly."
          />
          <FeatureCard
            title="🔒 Offline Mode"
            desc="Practice anytime—even without internet."
          />
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mt-8">
        <motion.h2
          {...fadeUp}
          className="text-center text-xl md:text-2xl font-bold theme-text mb-5"
        >
          Setup in 3 Simple Steps
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <StepCard step="Step 1" title="Download" desc="Choose your OS and download." />
          <StepCard step="Step 2" title="Install" desc="Open installer & follow steps." />
          <StepCard step="Step 3" title="Start Practicing" desc="Launch and begin instantly." />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="text-center mt-8 px-6">
        <motion.h2
          {...fadeUp}
          className="text-xl md:text-2xl font-bold theme-text"
        >
          Ready to Level Up Your Interview Skills?
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-4 mb-5"
        >
          Download the Intervue Desktop App and start your journey today.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center items-center gap-6"
        >
          <DownloadButton img={WindowsLogo} label="Windows" />
          <DownloadButton img={MacLogo} label="Mac" />
          <DownloadButton img={LinuxLogo} label="Linux" />
        </motion.div>
      </section>
    </div>
  );
};

/* Button */
const DownloadButton = ({ img, label }) => (
  <motion.a
    whileHover={{ scale: 1.06 }}
    className="px-6 py-3 rounded-2xl theme-primary font-semibold shadow-lg flex items-center gap-3"
    href="#"
  >
    <img src={img} alt={label} className="w-8 h-8" />
    Download for {label}
  </motion.a>
);

/* Feature Card */
const FeatureCard = ({ title, desc }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="glass-card p-7 rounded-3xl shadow-lg"
  >
    <h3 className="text-xl font-semibold theme-text mb-3">{title}</h3>
    <p className="text-gray-700">{desc}</p>
  </motion.div>
);

/* Step Card */
const StepCard = ({ step, title, desc }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="glass-card p-7 rounded-3xl text-center shadow-lg"
  >
    <p className="theme-text font-semibold mb-1">{step}</p>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-700">{desc}</p>
  </motion.div>
);

export default Download;
