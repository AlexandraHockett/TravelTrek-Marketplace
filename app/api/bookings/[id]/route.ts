// ===================================================================
// 📁 app/api/bookings/[id]/route.ts
// Location: REPLACE the entire content of app/api/bookings/[id]/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { bookingQueries } from "@/lib/db/queries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single booking by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await bookingQueries.getById(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
          code: "BOOKING_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking",
        code: "FETCH_BOOKING_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT - Update a booking
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingBooking = await bookingQueries.getById(id);
    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
          code: "BOOKING_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Validate status if provided
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status must be one of: ${validStatuses.join(", ")}`,
          code: "INVALID_STATUS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate payment status if provided
    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (
      body.paymentStatus &&
      !validPaymentStatuses.includes(body.paymentStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Payment status must be one of: ${validPaymentStatuses.join(", ")}`,
          code: "INVALID_PAYMENT_STATUS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    const allowedFields = [
      "customerName",
      "customerEmail",
      "date",
      "time",
      "participants",
      "status",
      "paymentStatus",
      "paymentId",
      "specialRequests",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Update total price if participants changed
    if (
      body.participants !== undefined &&
      existingBooking.booking &&
      existingBooking.tour
    ) {
      const newTotalPrice =
        Number(existingBooking.tour.price) * body.participants;
      updateData.totalPrice = newTotalPrice.toString();
    }

    const updatedBooking = await bookingQueries.update(id, updateData);

    if (!updatedBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update booking",
          code: "UPDATE_BOOKING_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update booking",
        code: "UPDATE_BOOKING_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existingBooking = await bookingQueries.getById(id);
    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
          code: "BOOKING_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const deleted = await bookingQueries.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete booking",
          code: "DELETE_BOOKING_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete booking",
        code: "DELETE_BOOKING_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
