"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatedButton } from "./AnimatedButton";
import { ResponseCard } from "./ResponseCard";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  track: z.string().min(1, "Please select a track"),
  tier: z.string().min(1, "Please select a tier"),
  coupon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const RegistrationForm = ({ workshop }: { workshop?: any }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "B", // Defalt to Prompt Engineering
      tier: "Standard",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setErrorStatus("");
    
    try {
      // DUMMY PAYMENT FLOW - Bypasses Razorpay and Supabase
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate 2s network delay for payment processing
      
      let calculatedAmount = 799;
      if (data.tier === "Early Bird") calculatedAmount = 399;
      if (data.tier === "Bundle") calculatedAmount = 1499;

      // Simulate success
      setSuccessData({
        name: data.name,
        email: data.email,
        amount: calculatedAmount,
        tier: data.tier,
        workshopTitle: "Upcoming Build Lab (Dummy Sandbox)",
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString(), // 1 week from now
      });

    } catch (error: any) {
      setErrorStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return <ResponseCard {...successData} />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-premium-dark border border-premium-charcoal rounded-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-premium-white mb-6">Secure Your Spot</h2>
      
      {/* Load Razorpay script dynamically */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-premium-gray text-sm mb-2">Full Name</label>
              <input
                {...register("name")}
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold transition-colors"
                placeholder="Rahul Sharma"
              />
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
            </div>
            
            <div>
              <label className="block text-premium-gray text-sm mb-2">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold transition-colors"
                placeholder="rahul@example.com"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-premium-gray text-sm mb-2">Phone Number (WhatsApp)</label>
              <input
                {...register("phone")}
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold transition-colors"
                placeholder="9876543210"
              />
              {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
            </div>

            <AnimatedButton
              label="Next Step"
              width="full"
              onClick={() => {
                // simple quick validation before step 2
                if (!errors.name && !errors.email && !errors.phone && watch("name") && watch("email") && watch("phone")) {
                  setStep(2);
                } else {
                  // trigger validation display
                  handleSubmit(onSubmit)();
                }
              }}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-premium-gray text-sm mb-2">Select Track</label>
              <select
                {...register("track")}
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold "
              >
                <option value="A">Track A: AI Tools Build Lab</option>
                <option value="B">Track B: Prompt Engineering Sprint</option>
                <option value="C">Track C: AI Automation Lab (n8n)</option>
              </select>
            </div>

            <div>
              <label className="block text-premium-gray text-sm mb-2">Select Tier</label>
              <select
                {...register("tier")}
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold "
              >
                <option value="Early Bird">Early Bird (₹399)</option>
                <option value="Standard">Standard (₹799) - Includes Starter Vault</option>
                <option value="Bundle">Builder Bundle (₹1499) - Includes 1:1 Session</option>
              </select>
            </div>

            <div>
              <label className="block text-premium-gray text-sm mb-2">Coupon Code (Optional)</label>
              <input
                {...register("coupon")}
                className="w-full bg-premium-black border border-premium-charcoal rounded p-3 text-premium-white outline-none focus:border-premium-gold transition-colors"
                placeholder="EARLYBIRD"
              />
            </div>

            {errorStatus && <div className="p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm rounded">{errorStatus}</div>}

            <div className="flex gap-4">
              <AnimatedButton
                label="Back"
                variant="outline"
                onClick={() => setStep(1)}
              />
              <AnimatedButton
                label={isLoading ? "Processing..." : "Pay Now"}
                type="submit"
                disabled={isLoading}
                icon
                width="full"
              />
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};
