"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AnimatedButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  icon?: boolean;
  width?: "auto" | "full";
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onClick,
  className,
  type = "button",
  disabled = false,
  variant = "primary",
  icon = false,
  width = "auto"
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 font-bold rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const widthStyles = width === "full" ? "w-full" : "";

  const variantStyles = {
    primary: "px-8 py-4 bg-premium-gold text-premium-black hover:bg-premium-goldHover shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(218,165,32,0.4)]",
    outline: "px-8 py-4 bg-transparent border border-premium-charcoal text-premium-white hover:border-premium-gold hover:text-premium-gold",
    ghost: "px-4 py-2 bg-transparent text-premium-gray hover:text-premium-white"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, widthStyles, variantStyles[variant], className)}
    >
      {label}
      {icon && <ChevronRight size={20} className={variant === "primary" ? "text-premium-black" : "text-current"} />}
    </motion.button>
  );
};
