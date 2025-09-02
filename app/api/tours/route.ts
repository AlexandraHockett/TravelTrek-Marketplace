// ===================================================================
// 📁 app/api/tours/route.ts
// Location: REPLACE the existing app/api/tours/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { tourQueries } from "@/lib/db/queries";

// GET - Fetch all tours with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const filters = {
      location: searchParams.get("location") || undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      minRating: searchParams.get("minRating")
        ? Number(searchParams.get("minRating"))
        : undefined,
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

    // Fetch tours from real database
    const result = await tourQueries.getAll(filters);

    return NextResponse.json({
      success: true,
      data: result.tours,
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
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tours",
        code: "FETCH_TOURS_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST - Create a new tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "location",
      "duration",
      "maxParticipants",
      "hostId",
      "price",
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

    // Validate data types
    if (typeof body.duration !== "number" || body.duration <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Duration must be a positive number (in hours)",
          code: "INVALID_DURATION",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Price must be a positive number",
          code: "INVALID_PRICE",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (typeof body.maxParticipants !== "number" || body.maxParticipants <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "MaxParticipants must be a positive number",
          code: "INVALID_MAX_PARTICIPANTS",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate difficulty enum
    const validDifficulties = ["Easy", "Moderate", "Hard"];
    if (body.difficulty && !validDifficulties.includes(body.difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
          code: "INVALID_DIFFICULTY",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Create tour data object
    const tourData = {
      title: body.title,
      description: body.description,
      shortDescription: body.shortDescription,
      image: body.image || "/images/tours/placeholder.jpg",
      images: Array.isArray(body.images)
        ? body.images
        : [body.image || "/images/tours/placeholder.jpg"],
      price: body.price.toString(),
      originalPrice: body.originalPrice
        ? body.originalPrice.toString()
        : undefined,
      currency: body.currency || "EUR",
      duration: body.duration,
      location: body.location,
      rating: "0",
      reviewCount: 0,
      maxParticipants: body.maxParticipants,
      minimumAge: body.minimumAge || null,
      difficulty: (body.difficulty || "Easy") as "Easy" | "Moderate" | "Hard",
      included: Array.isArray(body.included) ? body.included : [],
      excluded: Array.isArray(body.excluded) ? body.excluded : [],
      itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
      cancellationPolicy:
        body.cancellationPolicy ||
        "Free cancellation up to 24 hours before the experience starts",
      hostId: body.hostId,
      tags: Array.isArray(body.tags) ? body.tags : [],
      language: body.language || "pt",
    };

    // Create tour in database
    const newTour = await tourQueries.create(tourData);

    return NextResponse.json(
      {
        success: true,
        data: newTour,
        message: "Tour created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create tour",
        code: "CREATE_TOUR_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
