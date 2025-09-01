// File: lib/db/mockData.ts
// Location: CRIAR novo ficheiro em lib/db/mockData.ts

import { Tour, Booking } from "@/types";

// ✅ CORRIGIDO: Tours com tipos corretos
export const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Porto Food & Culture Walking Tour",
    description:
      "Discover authentic flavors and hidden gems in Porto's historic center",
    image: "/images/tours/porto-food-tour.webp",
    location: "Porto, Portugal",
    duration: 180, // ✅ CORRIGIDO: number em vez de string (3 hours = 180 minutes)
    maxParticipants: 12, // ✅ CORRIGIDO: obrigatório
    rating: 4.8, // ✅ CORRIGIDO: obrigatório
    reviewCount: 127,
    price: 65,
    originalPrice: 75,
    currency: "EUR",
    minimumAge: 12,
    difficulty: "Easy" as const,
    included: ["Professional guide", "Food tastings", "Wine samples"],
    excluded: ["Hotel pickup", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 24 hours before",
    hostId: "h1",
    tags: ["food", "culture", "walking", "history"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    language: "pt",
  },
  {
    id: "t2",
    title: "Sintra Magical Palaces Day Trip",
    description: "Visit Pena Palace and Quinta da Regaleira in romantic Sintra",
    image: "/images/tours/sintra-palaces.webp",
    location: "Sintra, Portugal",
    duration: 480, // ✅ CORRIGIDO: number (8 hours = 480 minutes)
    maxParticipants: 8, // ✅ CORRIGIDO: obrigatório
    rating: 4.9, // ✅ CORRIGIDO: obrigatório
    reviewCount: 89,
    price: 95,
    currency: "EUR",
    minimumAge: 8,
    difficulty: "Moderate" as const,
    included: ["Transportation", "Entry tickets", "Professional guide"],
    excluded: ["Lunch", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 48 hours before",
    hostId: "h2",
    tags: ["palaces", "history", "architecture", "unesco"],
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-20T14:15:00Z",
    language: "pt",
  },
  {
    id: "t3",
    title: "Douro Valley River Cruise",
    description: "Scenic cruise through UNESCO World Heritage vineyards",
    image: "/images/tours/douro-cruise.webp",
    location: "Douro Valley, Portugal",
    duration: 360, // ✅ CORRIGIDO: number (6 hours = 360 minutes)
    maxParticipants: 25, // ✅ CORRIGIDO: obrigatório
    rating: 4.7, // ✅ CORRIGIDO: obrigatório
    reviewCount: 203,
    price: 89,
    currency: "EUR",
    minimumAge: 0,
    difficulty: "Easy" as const,
    included: ["River cruise", "Wine tasting", "Regional lunch"],
    excluded: ["Hotel transfer", "Additional drinks"],
    cancellationPolicy: "Free cancellation up to 72 hours before",
    hostId: "h3",
    tags: ["river", "wine", "cruise", "unesco", "nature"],
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-18T09:45:00Z",
    language: "pt",
  },
  {
    id: "t4",
    title: "Lisbon Tuk-Tuk City Tour",
    description: "Fun eco-friendly tour of Lisbon's seven hills and viewpoints",
    image: "/images/tours/lisbon-tuktuk.webp",
    location: "Lisbon, Portugal",
    duration: 120, // ✅ CORRIGIDO: number (2 hours = 120 minutes)
    maxParticipants: 6, // ✅ CORRIGIDO: obrigatório
    rating: 4.6, // ✅ CORRIGIDO: obrigatório
    reviewCount: 156,
    price: 45,
    currency: "EUR",
    minimumAge: 5,
    difficulty: "Easy" as const,
    included: ["Tuk-tuk transportation", "Professional driver-guide"],
    excluded: ["Entrance fees", "Food and drinks"],
    cancellationPolicy: "Free cancellation up to 24 hours before",
    hostId: "h4",
    tags: ["city", "tuk-tuk", "viewpoints", "eco-friendly"],
    createdAt: "2025-01-04T00:00:00Z",
    updatedAt: "2025-01-22T16:20:00Z",
    language: "pt",
  },
];

// ✅ CORRIGIDO: Bookings com todas as propriedades obrigatórias
export const mockBookings: Booking[] = [
  {
    id: "b1",
    userId: "c1", // ✅ ADICIONADO: obrigatório
    totalPrice: 130, // ✅ ADICIONADO: obrigatório
    currency: "EUR", // ✅ ADICIONADO: obrigatório
    tourId: "t1",
    tourTitle: "Porto Food & Culture Walking Tour",
    tourImage: "/images/tours/porto-food-tour.webp",
    tourDescription:
      "Discover authentic flavors and hidden gems in Porto's historic center",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h1",
    hostName: "Maria Santos",
    hostPhone: "+351 912 345 678",
    hostEmail: "maria@traveltrek.com",
    hostAvatar: "/images/avatars/host-maria.webp",
    hostResponseTime: "< 1 hour",
    hostVerified: true,
    date: "2025-09-15",
    time: "14:00",
    participants: 2,
    basePrice: 65,
    totalAmount: 130,
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    specialRequests: "Vegetarian options please",
    meetingPoint: "Praça da Ribeira, next to the fountain",
    cancellationPolicy: "Free cancellation up to 24 hours before",
    createdAt: "2025-08-20T10:15:00Z",
    updatedAt: "2025-08-20T10:15:00Z",
    serviceFees: 0,
  },
  {
    id: "b2",
    userId: "c1", // ✅ ADICIONADO: obrigatório
    totalPrice: 195, // ✅ ADICIONADO: obrigatório
    currency: "EUR", // ✅ ADICIONADO: obrigatório
    tourId: "t2",
    tourTitle: "Sintra Magical Palaces Day Trip",
    tourImage: "/images/tours/sintra-palaces.webp",
    tourDescription:
      "Visit Pena Palace and Quinta da Regaleira in romantic Sintra",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h2",
    hostName: "Carlos Mendes",
    hostPhone: "+351 923 456 789",
    hostEmail: "carlos@traveltrek.com",
    hostAvatar: "/images/avatars/host-carlos.webp",
    hostResponseTime: "< 2 hours",
    hostVerified: true,
    date: "2025-09-20",
    time: "09:30",
    participants: 3,
    basePrice: 95,
    totalAmount: 285,
    status: "pending" as const,
    paymentStatus: "pending" as const,
    meetingPoint: "Sintra Train Station, main entrance",
    cancellationPolicy: "Free cancellation up to 48 hours before",
    createdAt: "2025-08-22T14:30:00Z",
    updatedAt: "2025-08-22T14:30:00Z",
    serviceFees: 0,
  },
  {
    id: "b3",
    userId: "c1", // ✅ ADICIONADO: obrigatório
    totalPrice: 178, // ✅ ADICIONADO: obrigatório
    currency: "EUR", // ✅ ADICIONADO: obrigatório
    tourId: "t3",
    tourTitle: "Douro Valley River Cruise",
    tourImage: "/images/tours/douro-cruise.webp",
    tourDescription: "Scenic cruise through UNESCO World Heritage vineyards",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h3",
    hostName: "Ana Ferreira",
    hostPhone: "+351 934 567 890",
    hostEmail: "ana@traveltrek.com",
    hostAvatar: "/images/avatars/host-ana.webp",
    hostResponseTime: "< 30 min",
    hostVerified: true,
    date: "2025-08-10",
    time: "10:00",
    participants: 2,
    basePrice: 89,
    totalAmount: 178,
    status: "completed" as const,
    paymentStatus: "paid" as const,
    specialRequests: "Wheelchair accessible please",
    meetingPoint: "Douro Marina, Pier 3",
    cancellationPolicy: "Free cancellation up to 72 hours before",
    createdAt: "2025-07-25T09:15:00Z",
    updatedAt: "2025-08-11T16:00:00Z",
    serviceFees: 0,
  },
  {
    id: "b4",
    userId: "c1", // ✅ ADICIONADO: obrigatório
    totalPrice: 45, // ✅ ADICIONADO: obrigatório
    currency: "EUR", // ✅ ADICIONADO: obrigatório
    tourId: "t4",
    tourTitle: "Lisbon Tuk-Tuk City Tour",
    tourImage: "/images/tours/lisbon-tuktuk.webp",
    tourDescription:
      "Fun eco-friendly tour of Lisbon's seven hills and viewpoints",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h4",
    hostName: "Ricardo Silva",
    hostPhone: "+351 945 678 901",
    hostEmail: "ricardo@traveltrek.com",
    hostAvatar: "/images/avatars/host-ricardo.webp",
    hostResponseTime: "< 1 hora",
    hostVerified: true,
    date: "2025-08-05",
    time: "16:00",
    participants: 1,
    basePrice: 45,
    totalAmount: 45,
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    specialRequests: "Early morning preferred",
    meetingPoint: "Rossio Square, central fountain",
    cancellationPolicy: "Free cancellation up to 24 hours before",
    createdAt: "2025-07-20T11:00:00Z",
    updatedAt: "2025-08-04T09:30:00Z",
    serviceFees: 0,
  },
];

// Helper functions for creating new bookings
export const createBookingData = (
  tourId: string,
  customerId: string,
  customerName: string,
  customerEmail: string,
  date: string,
  participants: number,
  specialRequests?: string
): Omit<Booking, "id" | "createdAt" | "updatedAt"> => {
  const tour = mockTours.find((t) => t.id === tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }

  const basePrice = tour.price;
  const totalAmount = basePrice * participants;

  return {
    userId: customerId, // ✅ CORRIGIDO: userId obrigatório
    totalPrice: totalAmount, // ✅ CORRIGIDO: totalPrice obrigatório
    currency: tour.currency, // ✅ CORRIGIDO: currency obrigatório
    tourId,
    tourTitle: tour.title,
    tourImage: tour.image,
    tourDescription: tour.description,
    customerId,
    customerName,
    customerEmail,
    hostId: tour.hostId,
    hostName: "Generic Host", // In real app, fetch from hosts table
    hostPhone: "+351 900 000 000",
    hostEmail: "host@traveltrek.com",
    hostAvatar: "/images/avatars/default-host.webp",
    hostResponseTime: "< 2 hours",
    hostVerified: true,
    date,
    time: "14:00", // Default time
    participants,
    basePrice,
    totalAmount,
    status: "pending" as const,
    paymentStatus: "pending" as const,
    specialRequests,
    meetingPoint: "To be confirmed by host",
    cancellationPolicy: tour.cancellationPolicy,
    serviceFees: 0,
  };
};
