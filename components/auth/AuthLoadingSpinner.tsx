// ===================================================================
// 📁 components/auth/AuthLoadingSpinner.tsx
// Location: CRIAR novo arquivo components/auth/AuthLoadingSpinner.tsx
// ===================================================================

"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  text?: string;
}

export default function AuthLoadingSpinner({
  size = "sm",
  className,
  showText = false,
  text = "Verificando...",
}: AuthLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader2
        className={cn("animate-spin text-gray-500", sizeClasses[size])}
      />
      {showText && (
        <span className="text-sm text-gray-500 font-medium">{text}</span>
      )}
    </div>
  );
}
