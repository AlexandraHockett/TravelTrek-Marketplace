// File: lib/mock/bookings.ts
// Location: CREATE this file in lib/mock/bookings.ts

import { Booking } from "@/types";

export const createMockBookings = (): Booking[] => [
  {
    // Core booking info
    id: "bk1",
    userId: "user1",
    tourId: "tour1",
    tourTitle: "Porto Walking Tour",
    tourDescription: "Discover the historic charm of Porto with local insights",
    tourImage: "/images/tours/porto-walking.jpg",
    location: "Porto, Portugal", // ✅ ADDED: Location property

    // Customer info
    customerId: "customer1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",

    // Host info
    hostId: "host1",
    hostName: "João Santos",
    hostEmail: "joao.santos@email.com",
    hostPhone: "+351 912 345 678",
    hostAvatar: "/images/hosts/joao.jpg",
    hostVerified: true,
    hostResponseTime: "Responde em 2 horas",

    // Booking details
    date: "2025-09-15",
    time: "14:00",
    participants: 2,
    specialRequests: "Preferimos um ritmo mais lento",
    meetingPoint: "Praça da Liberdade, junto à estátua",
    cancellationPolicy: "Cancelamento gratuito até 24h antes",

    // Pricing
    basePrice: 37.5,
    serviceFees: 0.0,
    totalAmount: 75.0,
    totalPrice: 75.0,
    currency: "EUR",

    // Status
    status: "confirmed",
    paymentStatus: "paid",

    // Timestamps
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2025-08-15T10:00:00Z",
  },
  {
    // Core booking info
    id: "bk2",
    userId: "user1",
    tourId: "tour2",
    tourTitle: "Lisbon Food Experience",
    tourDescription: "Authentic Portuguese flavors and hidden food spots",
    tourImage: "/images/tours/lisbon-food.jpg",
    location: "Lisboa, Portugal", // ✅ ADDED: Location property

    // Customer info
    customerId: "customer1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",

    // Host info
    hostId: "host2",
    hostName: "Ana Costa",
    hostEmail: "ana.costa@email.com",
    hostPhone: "+351 913 456 789",
    hostAvatar: "/images/hosts/ana.jpg",
    hostVerified: true,
    hostResponseTime: "Responde em 1 hora",

    // Booking details
    date: "2025-09-25",
    time: "18:30",
    participants: 4,
    specialRequests: "Uma pessoa é vegetariana",
    meetingPoint: "Rossio Square, junto à fonte central",
    cancellationPolicy: "Cancelamento gratuito até 48h antes",

    // Pricing
    basePrice: 45.0,
    serviceFees: 20.0,
    totalAmount: 200.0,
    totalPrice: 200.0,
    currency: "EUR",

    // Status
    status: "pending",
    paymentStatus: "pending",

    // Timestamps
    createdAt: "2025-08-20T15:30:00Z",
    updatedAt: "2025-08-20T15:30:00Z",
  },
  {
    // Core booking info
    id: "bk3",
    userId: "user1",
    tourId: "tour3",
    tourTitle: "Sintra Day Trip",
    tourDescription: "Explore fairy-tale palaces and stunning gardens",
    tourImage: "/images/tours/sintra-trip.jpg",
    location: "Sintra, Portugal", // ✅ ADDED: Location property

    // Customer info
    customerId: "customer1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",

    // Host info
    hostId: "host3",
    hostName: "Pedro Oliveira",
    hostEmail: "pedro.oliveira@email.com",
    hostPhone: "+351 914 567 890",
    hostAvatar: "/images/hosts/pedro.jpg",
    hostVerified: true,
    hostResponseTime: "Responde em 30 minutos",

    // Booking details
    date: "2025-07-30",
    time: "09:00",
    participants: 3,
    meetingPoint: "Estação de Sintra, saída principal",
    cancellationPolicy: "Cancelamento gratuito até 24h antes",

    // Pricing
    basePrice: 50.0,
    serviceFees: 0.0,
    totalAmount: 150.0,
    totalPrice: 150.0,
    currency: "EUR",

    // Status
    status: "completed",
    paymentStatus: "paid",

    // Timestamps
    createdAt: "2025-07-15T09:00:00Z",
    updatedAt: "2025-07-30T16:00:00Z",
  },
];

// Export individual mock for easy access
export const mockBookings = createMockBookings();
