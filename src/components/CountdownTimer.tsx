"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CountdownTimer = ({ targetDate }: { targetDate: Date | null }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return <div className="text-premium-gray">Loading schedule...</div>;
  }

  if (isLive) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-premium-gold mb-4 animate-pulse">
          Workshop is Live!
        </h3>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {timeBlocks.map((block, idx) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-premium-dark border border-premium-charcoal rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold text-premium-white shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={block.value}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {block.value.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-premium-gray text-xs sm:text-sm mt-2 uppercase tracking-widest font-mono">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};
