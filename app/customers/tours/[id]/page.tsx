// app/customer/tours/[id]/page.tsx
import BookingForm from "@/components/customer/BookingForm";
import { Tour } from "@/types";


async function getTour(id: string): Promise<Tour> {
  const res = await fetch(`http://localhost:3000/api/tours/${id}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTour(params.id);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{tour.title}</h1>
      <img
        src={tour.image}
        alt={tour.title}
        className="w-full h-96 object-cover rounded my-4"
      />
      <p className="text-gray-600">{tour.description}</p>
      <p className="text-lg font-semibold">${tour.price}</p>
      <BookingForm tourId={tour.id} />
    </div>
  );
}
