// ===================================================================
// 📁 app/api/bookings/route.ts
// Location: REPLACE the existing app/api/bookings/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { bookingQueries, tourQueries, userQueries } from "@/lib/db/queries";

// GET - Fetch all bookings with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const filters = {
      customerId: searchParams.get("customerId") || undefined,
      hostId: searchParams.get("hostId") || undefined,
      tourId: searchParams.get("tourId") || undefined,
      status: searchParams.get("status") || undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
      offset: searchParams.get("offset")
        ? Number(searchParams.get("offset"))
        : 0,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    // Fetch bookings from real database
    const result = await bookingQueries.getAll(filters);

    return NextResponse.json({
      success: true,
      data: result.bookings,
      pagination: {
        total: result.total,
        limit: filters.limit || 10,
        offset: filters.offset || 0,
        hasMore: (filters.offset || 0) + (filters.limit || 10) < result.total,
        currentPage:
          Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1,
        totalPages: Math.ceil(result.total / (filters.limit || 10)),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
        code: "FETCH_BOOKINGS_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "tourId",
      "customerId",
      "customerName",
      "customerEmail",
      "date",
      "time",
      "participants",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          code: "MISSING_FIELDS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate tour exists
    const tour = await tourQueries.getById(body.tourId);
    if (!tour) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour not found",
          code: "TOUR_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Validate customer exists
    const customer = await userQueries.getById(body.customerId);
    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
          code: "CUSTOMER_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Validate participants
    if (typeof body.participants !== "number" || body.participants <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Participants must be a positive number",
          code: "INVALID_PARTICIPANTS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (body.participants > tour.maxParticipants) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${tour.maxParticipants} participants allowed for this tour`,
          code: "TOO_MANY_PARTICIPANTS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.date)) {
      return NextResponse.json(
        {
          success: false,
          error: "Date must be in YYYY-MM-DD format",
          code: "INVALID_DATE_FORMAT",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(body.time)) {
      return NextResponse.json(
        {
          success: false,
          error: "Time must be in HH:mm format",
          code: "INVALID_TIME_FORMAT",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = Number(tour.price) * body.participants;

    // Create booking data object
    const bookingData = {
      tourId: body.tourId,
      customerId: body.customerId,
      hostId: tour.hostId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      date: body.date,
      time: body.time,
      participants: body.participants,
      totalPrice: totalPrice.toString(),
      currency: tour.currency,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      paymentId: null,
      specialRequests: body.specialRequests || null,
    };

    // Create booking in database
    const newBooking = await bookingQueries.create(bookingData);

    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: "Booking created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
        code: "CREATE_BOOKING_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
