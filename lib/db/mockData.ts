// File: lib/db/mockData.ts
// Location: Create this file in lib/db/mockData.ts

import { Tour, Booking, User } from "@/types";

// Mock Tours Data
export const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Historic Porto Walking Tour",
    description:
      "Explore the UNESCO World Heritage historic center of Porto with a knowledgeable local guide. Visit the most iconic landmarks and learn about the rich history of this beautiful Portuguese city.",
    shortDescription: "Explore Porto's historic center with a local guide",
    image: "/images/tours/porto-historic.jpg",
    images: [
      "/images/tours/porto-historic.jpg",
      "/images/tours/porto-cathedral.jpg",
      "/images/tours/porto-ribeira.jpg",
    ],
    price: 25,
    originalPrice: 35,
    currency: "EUR",
    duration: 180, // 3 hours in minutes
    location: "Porto, Portugal",
    rating: 4.8,
    reviewCount: 127,
    maxParticipants: 15,
    minimumAge: 8,
    difficulty: "Easy",
    included: [
      "Professional local guide",
      "Small group experience",
      "Historical insights",
    ],
    excluded: ["Food and drinks", "Transportation", "Entrance fees"],
    itinerary: [
      {
        time: "09:00",
        title: "Meet at Clérigos Tower",
        description: "Start your journey at Porto's iconic landmark",
      },
      {
        time: "09:30",
        title: "Porto Cathedral",
        description: "Visit the ancient cathedral and enjoy panoramic views",
      },
      {
        time: "11:00",
        title: "Ribeira District",
        description: "Explore the charming riverside quarter",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    hostId: "host-1",
    tags: ["history", "walking", "culture", "unesco"],
    language: "pt",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-20T15:45:00.000Z",
  },
  {
    id: "t2",
    title: "Douro Valley Wine Experience",
    description:
      "Discover the world-famous Douro Valley wine region with visits to traditional quintas, wine tastings, and breathtaking vineyard landscapes.",
    shortDescription: "Wine tasting tour in the stunning Douro Valley",
    image: "/images/tours/douro-valley.jpg",
    images: [
      "/images/tours/douro-valley.jpg",
      "/images/tours/douro-vineyard.jpg",
      "/images/tours/douro-river.jpg",
    ],
    price: 85,
    originalPrice: 95,
    currency: "EUR",
    duration: 480, // 8 hours in minutes
    location: "Douro Valley, Portugal",
    rating: 4.9,
    reviewCount: 89,
    maxParticipants: 12,
    minimumAge: 18,
    difficulty: "Moderate",
    included: [
      "Transportation",
      "Wine tastings",
      "Traditional lunch",
      "Expert guide",
    ],
    excluded: ["Additional drinks", "Souvenirs"],
    itinerary: [
      {
        time: "08:30",
        title: "Departure from Porto",
        description: "Comfortable transport to Douro Valley",
      },
      {
        time: "10:30",
        title: "First Quinta Visit",
        description: "Wine tasting and vineyard tour",
      },
      {
        time: "13:00",
        title: "Traditional Lunch",
        description: "Authentic Portuguese cuisine with wine pairing",
      },
      {
        time: "15:30",
        title: "River Cruise",
        description: "Scenic boat trip along the Douro River",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 48 hours before the experience starts",
    hostId: "host-2",
    tags: ["wine", "nature", "gastronomy", "river"],
    language: "en",
    createdAt: "2024-01-10T08:15:00.000Z",
    updatedAt: "2024-01-25T12:20:00.000Z",
  },
  {
    id: "t3",
    title: "Lisbon Tram 28 & Neighborhoods",
    description:
      "Experience Lisbon's iconic Tram 28 and explore the city's most charming neighborhoods including Alfama, Bairro Alto, and Chiado.",
    shortDescription:
      "Iconic tram tour through Lisbon's historic neighborhoods",
    image: "/images/tours/lisbon-tram.jpg",
    images: [
      "/images/tours/lisbon-tram.jpg",
      "/images/tours/lisbon-alfama.jpg",
      "/images/tours/lisbon-viewpoint.jpg",
    ],
    price: 35,
    originalPrice: 45,
    currency: "EUR",
    duration: 240, // 4 hours in minutes
    location: "Lisboa, Portugal",
    rating: 4.7,
    reviewCount: 203,
    maxParticipants: 8,
    minimumAge: 6,
    difficulty: "Easy",
    included: [
      "Tram tickets",
      "Local guide",
      "Walking tour",
      "Pastéis de nata tasting",
    ],
    excluded: ["Lunch", "Museum entries"],
    itinerary: [
      {
        time: "14:00",
        title: "Martim Moniz",
        description: "Board the famous Tram 28",
      },
      {
        time: "14:30",
        title: "Alfama District",
        description: "Explore the oldest neighborhood",
      },
      {
        time: "16:00",
        title: "Miradouro da Graça",
        description: "Enjoy panoramic city views",
      },
      {
        time: "17:00",
        title: "Pastéis de Belém",
        description: "Taste the original pastéis de nata",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    hostId: "host-1",
    tags: ["culture", "transport", "neighborhoods", "food"],
    language: "pt",
    createdAt: "2024-01-18T14:00:00.000Z",
    updatedAt: "2024-01-28T16:30:00.000Z",
  },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: "b1",
    tourId: "t1",
    customerId: "customer-1",
    hostId: "host-1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",
    date: "2024-03-15",
    time: "09:00",
    participants: 2,
    totalPrice: 50,
    currency: "EUR",
    status: "confirmed",
    paymentStatus: "paid",
    paymentId: "pi_1234567890",
    specialRequests: "Vegetarian lunch option preferred",
    createdAt: "2024-02-20T10:15:00.000Z",
    updatedAt: "2024-02-20T10:15:00.000Z",
  },
  {
    id: "b2",
    tourId: "t2",
    customerId: "customer-2",
    hostId: "host-2",
    customerName: "João Santos",
    customerEmail: "joao.santos@email.com",
    date: "2024-03-22",
    time: "08:30",
    participants: 4,
    totalPrice: 340,
    currency: "EUR",
    status: "pending",
    paymentStatus: "pending",
    paymentId: null,
    specialRequests: "Group celebration - anniversary",
    createdAt: "2024-02-25T15:30:00.000Z",
    updatedAt: "2024-02-25T15:30:00.000Z",
  },
  {
    id: "b3",
    tourId: "t3",
    customerId: "customer-1",
    hostId: "host-1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",
    date: "2024-04-05",
    time: "14:00",
    participants: 1,
    totalPrice: 35,
    currency: "EUR",
    status: "completed",
    paymentStatus: "paid",
    paymentId: "pi_0987654321",
    specialRequests: null,
    createdAt: "2024-03-01T09:45:00.000Z",
    updatedAt: "2024-04-05T18:00:00.000Z",
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: "customer-1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    avatar: "/images/avatars/maria.jpg",
    role: "customer",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "customer-2",
    name: "João Santos",
    email: "joao.santos@email.com",
    avatar: "/images/avatars/joao.jpg",
    role: "customer",
    createdAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "host-1",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    avatar: "/images/avatars/ana.jpg",
    role: "host",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "host-2",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    avatar: "/images/avatars/pedro.jpg",
    role: "host",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

// Helper function to create booking data
export function createBookingData(
  tourId: string,
  customerId: string,
  customerName: string,
  customerEmail: string,
  date: string,
  participants: number,
  specialRequests?: string
): Omit<Booking, "id" | "createdAt" | "updatedAt"> {
  const tour = mockTours.find((t) => t.id === tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }

  return {
    tourId,
    customerId,
    hostId: tour.hostId,
    customerName,
    customerEmail,
    date,
    time: "14:00", // Default time
    participants,
    totalPrice: tour.price * participants,
    currency: tour.currency,
    status: "pending",
    paymentStatus: "pending",
    paymentId: null,
    specialRequests: specialRequests || null,
  };
}

// Export default for easier importing
export default {
  mockTours,
  mockBookings,
  mockUsers,
  createBookingData,
};
