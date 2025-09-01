// File: app/api/bookings/route.ts
// Location: Create this file in app/api/bookings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Booking, Tour } from "@/types";

// Mock bookings data
let mockBookings: Booking[] = [
  {
    id: "booking-1",
    tourId: "1",
    tourTitle: "Historic Porto Walking Tour",
    tourDescription:
      "Discover the beautiful historic center of Porto with a local guide",
    tourImage: "/images/tours/porto-historic.jpg",
    customerId: "customer-1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",
    hostId: "host-1",
    hostName: "João Santos",
    hostAvatar: "/images/avatars/host-1.jpg",
    hostEmail: "joao.santos@traveltrek.com",
    hostPhone: "+351 912 345 678",
    hostVerified: true,
    hostResponseTime: "within 2 hours",
    date: "2025-01-15",
    time: "09:00",
    participants: 2,
    basePrice: 25,
    serviceFees: 5,
    totalAmount: 55, // (25 * 2) + 5
    status: "confirmed",
    paymentStatus: "paid",
    specialRequests:
      "We would like to know more about the architectural details",
    meetingPoint: "Livraria Lello, Rua das Carmelitas 144, Porto",
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "booking-2",
    tourId: "2",
    tourTitle: "Douro Valley Wine Experience",
    tourDescription:
      "Journey through the stunning Douro Valley, a UNESCO World Heritage site",
    tourImage: "/images/tours/douro-valley.jpg",
    customerId: "customer-2",
    customerName: "Anna Johnson",
    customerEmail: "anna.johnson@email.com",
    hostId: "host-2",
    hostName: "Pedro Costa",
    hostAvatar: "/images/avatars/host-2.jpg",
    hostEmail: "pedro.costa@traveltrek.com",
    hostPhone: "+351 923 456 789",
    hostVerified: true,
    hostResponseTime: "within 1 hour",
    date: "2025-01-20",
    time: "08:30",
    participants: 4,
    basePrice: 89,
    serviceFees: 15,
    totalAmount: 371, // (89 * 4) + 15
    status: "pending",
    paymentStatus: "pending",
    specialRequests: undefined, // Changed from null to undefined
    meetingPoint: "São Bento Station, Praça Almeida Garrett, Porto",
    cancellationPolicy:
      "Free cancellation up to 48 hours before the experience starts",
    createdAt: "2025-01-02T14:30:00Z",
    updatedAt: "2025-01-02T14:30:00Z",
  },
];

// Mock tours data for reference
const mockTours: Tour[] = [
  {
    id: "1",
    title: "Historic Porto Walking Tour",
    description:
      "Discover the beautiful historic center of Porto with a local guide",
    image: "/images/tours/porto-historic.jpg",
    price: 25,
    currency: "EUR",
    duration: 3,
    location: "Porto, Portugal",
    rating: 4.8,
    reviewCount: 127,
    maxParticipants: 15,
    difficulty: "Easy",
    hostId: "host-1",
    included: [],
    tags: [],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    language: "en",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - Fetch all bookings or filter by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const hostId = searchParams.get("hostId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let filteredBookings = [...mockBookings];

    // Apply filters
    if (customerId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.customerId === customerId
      );
    }

    if (hostId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.hostId === hostId
      );
    }

    if (status) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === status
      );
    }

    // Sort by creation date (newest first)
    filteredBookings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const total = filteredBookings.length;
    const paginatedBookings = filteredBookings.slice(offset, offset + limit);

    return NextResponse.json({
      bookings: paginatedBookings,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const requiredFields = [
      "tourId",
      "customerId",
      "customerName",
      "customerEmail",
      "date",
      "participants",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Find the tour to get details
    const tour = mockTours.find((t) => t.id === body.tourId);
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Validate participants
    if (body.participants > tour.maxParticipants) {
      return NextResponse.json(
        {
          error: `Maximum ${tour.maxParticipants} participants allowed for this tour`,
        },
        { status: 400 }
      );
    }

    // Calculate pricing
    const basePrice = tour.price;
    const serviceFees = Math.round(basePrice * body.participants * 0.1); // 10% service fee
    const totalAmount = basePrice * body.participants + serviceFees;

    // Create new booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      tourId: body.tourId,
      tourTitle: tour.title,
      tourDescription: tour.description,
      tourImage: tour.image,
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      hostId: tour.hostId,
      hostName: body.hostName || "Local Host",
      hostAvatar: body.hostAvatar,
      hostEmail: body.hostEmail || "host@traveltrek.com",
      hostPhone: body.hostPhone || "+351 900 000 000",
      hostVerified: true,
      hostResponseTime: "within 2 hours",
      date: body.date,
      time: body.time || "09:00",
      participants: parseInt(body.participants),
      basePrice,
      serviceFees,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      specialRequests: body.specialRequests || undefined, // Changed from null to undefined
      meetingPoint: body.meetingPoint || `Meeting point for ${tour.title}`,
      cancellationPolicy: tour.cancellationPolicy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockBookings.push(newBooking);

    return NextResponse.json(
      {
        booking: newBooking,
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// Helper function to calculate booking statistics
function calculateBookingStats(
  bookings: Booking[],
  customerId?: string,
  hostId?: string
) {
  const userBookings = bookings.filter((booking) => {
    if (customerId) return booking.customerId === customerId;
    if (hostId) return booking.hostId === hostId;
    return true;
  });

  const totalBookings = userBookings.length;
  const pendingBookings = userBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const confirmedBookings = userBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedBookings = userBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledBookings = userBookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const totalSpent = userBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const upcomingBookings = userBookings.filter((b) => {
    const bookingDate = new Date(b.date);
    const now = new Date();
    return (
      bookingDate > now && (b.status === "confirmed" || b.status === "pending")
    );
  }).length;

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalSpent,
    upcomingBookings,
  };
}
