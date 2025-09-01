// File: app/api/bookings/route.ts
// Location: SUBSTITUIR o ficheiro existente app/api/bookings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockBookings, mockTours, createBookingData } from "@/lib/db/mockData";
import { Booking } from "@/types";

// GET - Fetch bookings with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get("customerId");
    const hostId = searchParams.get("hostId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

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

    // ✅ CORRIGIDO: Validação com verificação de undefined
    const maxParticipants = tour.maxParticipants; // Agora obrigatório
    if (body.participants > maxParticipants) {
      return NextResponse.json(
        {
          error: `Maximum ${maxParticipants} participants allowed for this tour`,
        },
        { status: 400 }
      );
    }

    // Create booking data using helper function
    const bookingData = createBookingData(
      body.tourId,
      body.customerId,
      body.customerName,
      body.customerEmail,
      body.date,
      body.participants,
      body.specialRequests
    );

    // Generate new booking with ID and timestamps
    const newBooking: Booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      time: body.time || "14:00",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database (in real app, this would be a DB insert)
    mockBookings.push(newBooking);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
