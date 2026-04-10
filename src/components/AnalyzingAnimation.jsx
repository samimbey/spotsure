import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const messages = [
  "Reading the sign…",
  "Checking restrictions…",
  "Analyzing time rules…",
  "Almost there…",
];

export default function AnalyzingAnimation() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
      {/* Road SVG */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 120 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Road body - S-curve with perspective, wide at bottom narrowing at top */}
          <motion.path
            d="M 30 160 C 30 140, 90 130, 80 100 C 70 70, 20 60, 40 30 C 50 15, 80 10, 85 5"
            stroke="hsl(210 100% 56%)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0.4,
              },
              opacity: { duration: 0.4 },
            }}
          />
          {/* Dashed center line */}
          <motion.path
            d="M 30 160 C 30 140, 90 130, 80 100 C 70 70, 20 60, 40 30 C 50 15, 80 10, 85 5"
            stroke="hsl(var(--background))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 10"
            fill="none"
            pathLength="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              pathLength: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0.4,
              },
            }}
          />
        </svg>
      </div>

      {/* Cycling message */}
      <div className="text-center space-y-2">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="text-base font-semibold text-foreground"
        >
          {messages[msgIndex]}
        </motion.p>
        <p className="text-sm text-muted-foreground">This takes 2–3 seconds</p>
      </div>
    </div>
  );
}