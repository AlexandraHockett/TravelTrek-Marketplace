"use client";

import { cn } from "@/lib/utils";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "sm" | "lg";
}

export default function Button({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center rounded-md font-medium transition-[color,box-shadow] outline-none";
  const variantStyles = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[color-mix(in_oklab,var(--color-primary)_90%,black)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--color-primary)_50%,transparent)] aria-invalid:border-destructive",
    secondary:
      "bg-[var(--color-secondary)] text-white hover:bg-[color-mix(in_oklab,var(--color-secondary)_90%,black)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_50%,transparent)] aria-invalid:border-destructive",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1.5 text-xs",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      data-variant={variant}
      data-size={size}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
