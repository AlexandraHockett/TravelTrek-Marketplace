// File: app/api/bookings/[id]/route.ts
// Location: SUBSTITUIR o ficheiro existente app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockBookings } from "@/lib/db/mockData";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single booking by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const booking = mockBookings.find((b) => b.id === id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT - Update a booking
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const bookingIndex = mockBookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Validate status if provided
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        },
        { status: 400 }
      );
    }

    // Validate paymentStatus if provided
    const validPaymentStatuses = ["pending", "paid", "refunded"];
    if (
      body.paymentStatus &&
      !validPaymentStatuses.includes(body.paymentStatus)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment status. Must be one of: " +
            validPaymentStatuses.join(", "),
        },
        { status: 400 }
      );
    }

    // Validate participants if provided
    if (
      body.participants !== undefined &&
      (typeof body.participants !== "number" || body.participants <= 0)
    ) {
      return NextResponse.json(
        { error: "Participants must be a positive number" },
        { status: 400 }
      );
    }

    // ✅ CORRIGIDO: All bookings already have required fields from mockData
    const updatedBooking = {
      ...mockBookings[bookingIndex],
      ...body,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };

    mockBookings[bookingIndex] = updatedBooking;

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete a booking
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const bookingIndex = mockBookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = mockBookings[bookingIndex];

    // Check if booking can be cancelled
    if (booking.status === "completed" || booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot cancel a completed or already cancelled booking" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
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

    return NextResponse.json(cancelledBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
