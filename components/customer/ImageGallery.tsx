// File: components/customer/ImageGallery.tsx
// Location: Create this NEW file in components/customer/

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Button from "@/components/ui/Button";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle case where no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full">
        {/* Main Image */}
        <div className="relative group mb-4">
          <div
            className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden cursor-pointer relative"
            onClick={() => openModal(currentImageIndex)}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${alt} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.webp";
              }}
            />

            {/* Zoom overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2">
                <ZoomIn className="w-6 h-6 text-gray-800" />
              </div>
            </div>

            {/* Navigation arrows (only show if more than 1 image) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Grid (only show if more than 1 image) */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square ${
                  index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => {
                  setCurrentImageIndex(index);
                  openModal(index);
                }}
              >
                <img
                  src={image}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder.webp";
                  }}
                />
                {/* Show +X more overlay on last thumbnail if there are more images */}
                {index === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-semibold">
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 text-white transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal image */}
            <img
              src={images[currentImageIndex]}
              alt={`${alt} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.webp";
              }}
            />

            {/* Modal navigation (only show if more than 1 image) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Modal image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} of {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
