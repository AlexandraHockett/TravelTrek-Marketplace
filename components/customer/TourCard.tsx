// components/customer/TourCard.tsx
"use client";
import { Tour } from "@/types";
import Link from "next/link";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/customer/tours/${tour.id}`}>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="text-lg font-semibold mt-2">{tour.title}</h3>
        <p className="text-gray-600">${tour.price}</p>
        <p className="text-yellow-500">★★★★☆</p>
      </div>
    </Link>
  );
}
