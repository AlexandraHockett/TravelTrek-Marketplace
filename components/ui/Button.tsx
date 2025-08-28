// File: components/ui/Button.tsx
// Location: Create this file in components/ui/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center rounded-md font-medium",
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      {
        "px-3 py-1.5 text-sm": size === "sm",
        "px-4 py-2 text-sm": size === "md",
        "px-6 py-3 text-base": size === "lg",
      }
    );

    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm",
      secondary:
        "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-sm",
      default:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
      danger:
        "bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], className)}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}

        {children}

        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
