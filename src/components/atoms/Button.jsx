import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-primary-500 hover:bg-primary-600 text-white border-transparent hover:border-primary-600",
    outline: "border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent",
    ghost: "hover:bg-slate-100 text-slate-700 border-transparent",
    link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline border-transparent"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm rounded",
    default: "h-10 px-4 py-2 rounded-lg",
    lg: "h-12 px-8 rounded-lg text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;