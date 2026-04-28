// components/ui/Input.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className, id, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2", fullWidth ? "w-full" : "w-auto")}>
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-bold text-slate-700 ms-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={id}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 bg-slate-50 px-4 py-2 text-base transition-all duration-200",
              "placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:bg-white",
              error 
                ? "border-rose-500 focus:border-rose-500" 
                : "border-slate-200 focus:border-teal-600",
              icon ? "ps-12" : "ps-4",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-500 ms-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
