// ===================================================================
// 📁 app/api/tours/[id]/route.ts
// Location: REPLACE the existing app/api/tours/[id]/route.ts
// ===================================================================

import { tourQueries } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single tour by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Fetch tour from real database
    const tour = await tourQueries.getById(id);

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

    return NextResponse.json({
      success: true,
      data: tour,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tour",
        code: "FETCH_TOUR_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT - Update a tour
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if tour exists
    const existingTour = await tourQueries.getById(id);
    if (!existingTour) {
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

    // Validate data types if provided
    if (body.duration !== undefined) {
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
    }

    if (body.price !== undefined) {
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
    }

    if (body.maxParticipants !== undefined) {
      if (
        typeof body.maxParticipants !== "number" ||
        body.maxParticipants <= 0
      ) {
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
    }

    if (body.rating !== undefined) {
      if (
        typeof body.rating !== "number" ||
        body.rating < 0 ||
        body.rating > 5
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Rating must be a number between 0 and 5",
            code: "INVALID_RATING",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    // Validate difficulty enum
    if (body.difficulty) {
      const validDifficulties = ["Easy", "Moderate", "Hard"];
      if (!validDifficulties.includes(body.difficulty)) {
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
    }

    // Prepare update data
    const updateData: any = {};

    // Only include fields that are provided
    const allowedFields = [
      "title",
      "description",
      "shortDescription",
      "image",
      "images",
      "price",
      "originalPrice",
      "currency",
      "duration",
      "location",
      "rating",
      "reviewCount",
      "maxParticipants",
      "minimumAge",
      "difficulty",
      "included",
      "excluded",
      "itinerary",
      "cancellationPolicy",
      "tags",
      "language",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === "price" || field === "originalPrice") {
          updateData[field] = body[field].toString();
        } else if (field === "rating") {
          updateData[field] = body[field].toString();
        } else {
          updateData[field] = body[field];
        }
      }
    });

    // Update tour in database
    const updatedTour = await tourQueries.update(id, updateData);

    if (!updatedTour) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update tour",
          code: "UPDATE_TOUR_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTour,
      message: "Tour updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update tour",
        code: "UPDATE_TOUR_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tour (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if tour exists
    const existingTour = await tourQueries.getById(id);
    if (!existingTour) {
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

    // Soft delete tour
    const deleted = await tourQueries.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete tour",
          code: "DELETE_TOUR_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete tour",
        code: "DELETE_TOUR_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
