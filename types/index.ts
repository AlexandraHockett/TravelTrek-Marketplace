// File: types/index.ts
// Location: Make sure this file matches exactly with proper TypeScript types
export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  duration: number; // in hours
  location: string;
  rating: number;
  reviewCount: number;
  maxParticipants: number;
  minimumAge?: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  included: string[];
  excluded?: string[];
  itinerary?: ItineraryItem[];
  cancellationPolicy: string;
  hostId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

// File: app/types.ts
export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  hostId: string;
  date: string;
  participants: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "host";
  createdAt: string;
}
