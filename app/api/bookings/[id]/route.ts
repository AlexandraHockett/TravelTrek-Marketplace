// File: app/api/bookings/[id]/route.ts
// Location: Create this file in app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/types";

// Mock bookings data (same as main bookings route)
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
    totalAmount: 55,
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
    totalAmount: 371,
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

// GET - Fetch a specific booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = mockBookings.find((booking) => booking.id === id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingIndex = mockBookings.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const existingBooking = mockBookings[bookingIndex];

    // Validate status changes
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // Validate payment status changes
    const validPaymentStatuses = ["pending", "paid", "refunded"];
    if (
      body.paymentStatus &&
      !validPaymentStatuses.includes(body.paymentStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 }
      );
    }

    // Check business rules for status changes
    if (body.status === "cancelled") {
      const bookingDate = new Date(existingBooking.date);
      const now = new Date();
      const hoursUntilBooking =
        (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Check cancellation policy (24 or 48 hours)
      const minCancellationHours = existingBooking.cancellationPolicy.includes(
        "48 hours"
      )
        ? 48
        : 24;

      if (
        hoursUntilBooking < minCancellationHours &&
        existingBooking.status !== "pending"
      ) {
        return NextResponse.json(
          {
            error: `Cancellation not allowed. Must be at least ${minCancellationHours} hours before the experience.`,
          },
          { status: 400 }
        );
      }
    }

    // Recalculate if participants changed
    let updatedBooking = { ...existingBooking, ...body };

    if (
      body.participants &&
      body.participants !== existingBooking.participants
    ) {
      const serviceFees = Math.round(
        existingBooking.basePrice * body.participants * 0.1
      );
      const totalAmount =
        existingBooking.basePrice * body.participants + serviceFees;

      updatedBooking = {
        ...updatedBooking,
        participants: body.participants,
        serviceFees,
        totalAmount,
      };
    }

    // Update timestamp
    updatedBooking.updatedAt = new Date().toISOString();

    // Save changes
    mockBookings[bookingIndex] = updatedBooking;

    return NextResponse.json({
      booking: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingIndex = mockBookings.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = mockBookings[bookingIndex];

    // Check if booking can be cancelled
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const minCancellationHours = booking.cancellationPolicy.includes("48 hours")
      ? 48
      : 24;

    if (
      hoursUntilBooking < minCancellationHours &&
      booking.status !== "pending"
    ) {
      return NextResponse.json(
        {
          error: `Cancellation not allowed. Must be at least ${minCancellationHours} hours before the experience.`,
        },
        { status: 400 }
      );
    }

    // Update booking status to cancelled instead of deleting
    const cancelledBooking = {
      ...booking,
      status: "cancelled" as const,
      paymentStatus:
        booking.paymentStatus === "paid"
          ? ("refunded" as const)
          : ("pending" as const),
      updatedAt: new Date().toISOString(),
    };

    mockBookings[bookingIndex] = cancelledBooking;

    return NextResponse.json({
      booking: cancelledBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

// PATCH - Update specific fields of a booking (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingIndex = mockBookings.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow certain fields to be patched
    const allowedFields = ["specialRequests", "participants", "date", "time"];
    const updates: Partial<Booking> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field as keyof Booking] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const existingBooking = mockBookings[bookingIndex];

    // Recalculate if participants changed
    if (
      updates.participants &&
      updates.participants !== existingBooking.participants
    ) {
      const serviceFees = Math.round(
        existingBooking.basePrice * updates.participants * 0.1
      );
      const totalAmount =
        existingBooking.basePrice * updates.participants + serviceFees;
      updates.serviceFees = serviceFees;
      updates.totalAmount = totalAmount;
    }

    const updatedBooking = {
      ...existingBooking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockBookings[bookingIndex] = updatedBooking;

    return NextResponse.json({
      booking: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error patching booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
