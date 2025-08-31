// File: components/shared/TourImage.tsx
// Location: CRIAR novo ficheiro components/shared/TourImage.tsx

"use client";

import React, { useState } from "react";

interface TourImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export default function TourImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/placeholders/tour-placeholder.webp",
  priority = false,
}: TourImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
