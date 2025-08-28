// File: components/ui/Skeleton.tsx
// Location: Create this file in components/ui/Skeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}) => {
  const baseStyles = "animate-pulse bg-gray-200";

  const variantStyles = {
    text: "rounded h-4",
    rectangular: "rounded",
    circular: "rounded-full",
  };

  const combinedStyle = {
    ...style,
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={combinedStyle}
      {...props}
    />
  );
};

export default Skeleton;
