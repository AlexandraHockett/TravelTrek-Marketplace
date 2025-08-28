// app/customer/tours/page.tsx
import TourCard from "@/components/customer/TourCard";
import { Tour } from "@/types";

async function getTours(): Promise<Tour[]> {
  const res = await fetch("http://localhost:3000/api/tours", {
    cache: "no-store",
  });
  return res.json();
}

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Tours</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
