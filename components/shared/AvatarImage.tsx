// File: components/shared/AvatarImage.tsx
// Location: CRIAR novo ficheiro components/shared/AvatarImage.tsx

"use client";

import React, { useState } from "react";

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AvatarImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/default-avatar.webp",
  size = "md",
}: AvatarImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  // Define size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const combinedClassName = `${sizeClasses[size]} rounded-full object-cover ${className}`;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={combinedClassName}
      onError={handleError}
      loading="lazy"
    />
  );
}
