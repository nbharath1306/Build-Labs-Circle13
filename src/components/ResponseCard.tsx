"use client";

import { motion } from "framer-motion";
import { CheckCircle, CalendarPlus, MessageCircle, X } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";

type ResponseCardProps = {
  name: string;
  workshopTitle: string;
  dateTime: string;
  tier: string;
  amount: number;
  email: string;
  onDismiss?: () => void;
};

export const ResponseCard = ({
  name,
  workshopTitle,
  dateTime,
  tier,
  amount,
  email,
  onDismiss,
}: ResponseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-8 bg-premium-dark border border-premium-gold/30 rounded-xl max-w-lg w-full shadow-[0_0_40px_rgba(212,175,55,0.15)] relative"
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-premium-gray hover:text-premium-white"
        >
          <X size={24} />
        </button>
      )}

      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-premium-gold" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold text-premium-white text-center mb-2">
        You're In, {name.split(" ")[0]}!
      </h2>
      <p className="text-premium-gray text-center mb-8">
        Your spot is secured. Let's build something real.
      </p>

      <div className="bg-premium-black border border-premium-charcoal rounded-lg p-6 mb-8 space-y-4">
        <div className="flex justify-between pb-4 border-b border-premium-charcoal">
          <span className="text-premium-gray">Workshop</span>
          <span className="font-semibold text-right">{workshopTitle}</span>
        </div>
        <div className="flex justify-between pb-4 border-b border-premium-charcoal">
          <span className="text-premium-gray">Schedule</span>
          <span className="font-semibold">{dateTime}</span>
        </div>
        <div className="flex justify-between pb-4 border-b border-premium-charcoal">
          <span className="text-premium-gray">Tier</span>
          <span className="font-semibold">{tier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-premium-gray">Amount Paid</span>
          <span className="font-bold text-premium-gold">₹{amount}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatedButton
          label="Add to Google Calendar"
          icon
          width="full"
          className="bg-white text-black hover:bg-gray-200"
          onClick={() => {
            // Generates simple google calendar link
            const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(workshopTitle)}`;
            window.open(url, "_blank");
          }}
        />

        <AnimatedButton
          label="Join Builder Community"
          variant="outline"
          width="full"
          onClick={() => window.open("https://chat.whatsapp.com/your-group", "_blank")}
        />
      </div>

      <p className="text-xs text-center text-premium-gray mt-6">
        A welcome email with your resources has been sent to {email}.
      </p>
    </motion.div>
  );
};
