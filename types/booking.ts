// types/booking.ts
export interface Booking {
  id: string;
  customerName: string;
  tourTitle: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}
