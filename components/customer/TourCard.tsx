"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tour } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface TourCardProps {
  tour: Tour;
  className?: string;
}

const TourCard: React.FC<TourCardProps> = ({ tour, className }) => {
  const discountPercentage = tour.originalPrice
    ? Math.round((1 - tour.price / tour.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/customer/tours/${tour.id}`}>
      <Card
        padding="none"
        hover
        className={cn("overflow-hidden group", className)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-error text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={cn("text-xs font-medium px-2 py-1 rounded-full", {
                "bg-success text-white": tour.difficulty === "Easy",
                "bg-warning text-white": tour.difficulty === "Moderate",
                "bg-error text-white": tour.difficulty === "Challenging",
              })}
            >
              {tour.difficulty}
            </span>
          </div>

          {/* Quick Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {tour.duration}h • Máx. {tour.maxParticipants} pessoas
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <svg
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {tour.location}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {tour.title}
          </h3>

          {/* Short Description */}
          {tour.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {tour.shortDescription}
            </p>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-900 ml-1">
                {tour.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({tour.reviewCount} avaliações)
            </span>
          </div>

          {/* Tags */}
          {tour.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tour.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tour.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{tour.tags.length - 3} mais
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              {tour.originalPrice && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  {formatCurrency(tour.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(tour.price)}
              </span>
              <span className="text-sm text-gray-500 ml-1">por pessoa</span>
            </div>

            <div className="text-xs text-gray-500">{tour.duration}h</div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TourCard;
