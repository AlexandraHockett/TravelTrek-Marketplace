// components/customer/BookingForm.tsx
"use client";
import { useState } from "react";
import Button from "../shared/Button";
interface BookingFormProps {
  tourId: string;
}

export default function BookingForm({ tourId }: BookingFormProps) {
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call API route: app/api/bookings/route.ts
    const res = await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ tourId, date, participants }),
    });
    if (res.ok) {
      alert("Booking created!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Participants</label>
        <input
          type="number"
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>
      <Button type="submit">Book Now</Button>
    </form>
  );
}
