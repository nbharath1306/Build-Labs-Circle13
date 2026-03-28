"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedButton } from "./AnimatedButton";
import { CheckCircle2 } from "lucide-react";

export type PricingTier = {
  id: string;
  title: string;
  price: number;
  highlight?: boolean;
  features: string[];
  ctaText?: string;
};

export const FeatureCard = ({
  tiers,
  onSelectTier,
}: {
  tiers: PricingTier[];
  onSelectTier: (tierId: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mt-8">
      {tiers.map((tier, idx) => (
        <motion.div
          key={tier.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className={`relative flex flex-col p-8 rounded-xl border ${
            tier.highlight
              ? "border-premium-gold bg-premium-dark shadow-[0_0_30px_rgba(212,175,55,0.15)] md:-mt-4 md:mb-4"
              : "border-premium-charcoal bg-premium-black"
          }`}
        >
          {tier.highlight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-premium-gold text-premium-black font-bold text-xs uppercase tracking-widest px-4 py-1 rounded-full">
              Most Popular
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-premium-white mb-2">{tier.title}</h3>
            <div className="text-4xl font-bold text-premium-gold mb-2">
              ₹{tier.price}
            </div>
          </div>

          <div className="flex-1">
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start text-premium-gray">
                  <CheckCircle2 className="w-5 h-5 text-premium-gold shrink-0 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <AnimatedButton
            label={tier.ctaText || "Select Tier"}
            onClick={() => onSelectTier(tier.id)}
            variant={tier.highlight ? "primary" : "outline"}
            width="full"
          />
        </motion.div>
      ))}
    </div>
  );
};
