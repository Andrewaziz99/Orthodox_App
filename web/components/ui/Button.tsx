// components/ui/Button.tsx
"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "link" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string; // Renders as <Link> if provided
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode; // Leading icon
  iconPosition?: "start" | "end";
  className?: string;
  id?: string;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  href,
  onClick,
  disabled,
  fullWidth = false,
  type = "button",
  icon,
  iconPosition = "start",
  className,
  id,
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20",
    secondary:
      "bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-600/20",
    ghost:
      "bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    outline: 
      "bg-transparent border-2 border-current hover:bg-white/10",
    white: 
      "bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-slate-900/10 border-none",
    link: "bg-transparent text-teal-600 hover:underline p-0 h-auto",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl font-semibold",
    lg: "px-8 py-4 text-lg rounded-xl font-bold",
  };

  const baseStyles = cn(
    "inline-flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:scale-100",
    fullWidth ? "w-full" : "w-auto",
    variants[variant],
    variant !== "link" && sizes[size],
    className
  );

  const content = (
    <>
      {icon && iconPosition === "start" && (
        <span className={cn(children ? "me-2.5" : "")}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "end" && (
        <span className={cn(children ? "ms-2.5" : "")}>{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles} id={id}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseStyles}
      onClick={onClick}
      disabled={disabled}
      id={id}
    >
      {content}
    </button>
  );
};
