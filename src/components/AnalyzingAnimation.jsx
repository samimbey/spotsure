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
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Road surface (wide, grey) */}
          <motion.path
            d="M 100 190 
               C 100 190, 40 170, 40 140 
               C 40 110, 160 110, 160 80 
               C 160 50, 40 50, 40 20 
               C 40 10, 100 10, 100 10"
            stroke="hsl(215 15% 28%)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.3 },
              opacity: { duration: 0.4 },
            }}
          />
          {/* Road edges (subtle lighter border) */}
          <motion.path
            d="M 100 190 
               C 100 190, 40 170, 40 140 
               C 40 110, 160 110, 160 80 
               C 160 50, 40 50, 40 20 
               C 40 10, 100 10, 100 10"
            stroke="hsl(215 15% 40%)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="0"
            style={{ filter: "none" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.3 },
              opacity: { duration: 0.4 },
            }}
          />
          {/* Road surface inner (dark fill) */}
          <motion.path
            d="M 100 190 
               C 100 190, 40 170, 40 140 
               C 40 110, 160 110, 160 80 
               C 160 50, 40 50, 40 20 
               C 40 10, 100 10, 100 10"
            stroke="hsl(225 20% 12%)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.3 },
              opacity: { duration: 0.4 },
            }}
          />
          {/* Dashed center lane line */}
          <motion.path
            d="M 100 190 
               C 100 190, 40 170, 40 140 
               C 40 110, 160 110, 160 80 
               C 160 50, 40 50, 40 20 
               C 40 10, 100 10, 100 10"
            stroke="hsl(45 93% 60%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="10 10"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.3 },
              opacity: { duration: 0.4 },
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