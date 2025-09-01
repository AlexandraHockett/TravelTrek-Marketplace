// File: app/api/tours/route.ts
// Location: SUBSTITUIR o ficheiro existente app/api/tours/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockTours } from "@/lib/db/mockData";
import { Tour } from "@/types";

// GET - Fetch tours with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");
    const maxPrice = searchParams.get("maxPrice");
    const difficulty = searchParams.get("difficulty");
    const minRating = searchParams.get("minRating");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sortBy") || "newest";

    let filteredTours = [...mockTours];

    // Apply filters
    if (location) {
      filteredTours = filteredTours.filter((tour) =>
        tour.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      filteredTours = filteredTours.filter((tour) => tour.price <= maxPriceNum);
    }

    if (difficulty) {
      filteredTours = filteredTours.filter(
        (tour) => tour.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      // ✅ CORRIGIDO: rating agora é obrigatório, não precisa verificar undefined
      filteredTours = filteredTours.filter(
        (tour) => tour.rating >= minRatingNum
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filteredTours.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredTours.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredTours.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filteredTours.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
      default:
        filteredTours.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const total = filteredTours.length;
    const paginatedTours = filteredTours.slice(offset, offset + limit);

    return NextResponse.json({
      tours: paginatedTours,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST - Create a new tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const requiredFields = [
      "title",
      "description",
      "location",
      "duration", // ✅ CORRIGIDO: duration deve ser number
      "price",
      "currency",
      "difficulty",
      "hostId",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate duration is a number
    if (typeof body.duration !== "number" || body.duration <= 0) {
      return NextResponse.json(
        { error: "Duration must be a positive number (in minutes)" },
        { status: 400 }
      );
    }

    // Validate price is a number
    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Create new tour
    const newTour: Tour = {
      id: `t${Date.now()}`,
      title: body.title,
      description: body.description,
      image: body.image || "/images/tours/placeholder.webp",
      location: body.location,
      duration: body.duration, // ✅ CORRIGIDO: number
      maxParticipants: body.maxParticipants || 10, // ✅ CORRIGIDO: obrigatório com default
      rating: body.rating || 0, // ✅ CORRIGIDO: obrigatório com default
      reviewCount: body.reviewCount || 0,
      amenities: body.amenities || [],
      shortDescription: body.shortDescription,
      images: body.images || [],
      price: body.price,
      originalPrice: body.originalPrice,
      currency: body.currency,
      minimumAge: body.minimumAge || 0,
      difficulty: body.difficulty,
      included: body.included || [],
      excluded: body.excluded || [],
      itinerary: body.itinerary || [],
      cancellationPolicy:
        body.cancellationPolicy || "Free cancellation up to 24 hours before",
      hostId: body.hostId,
      tags: body.tags || [],
      language: body.language || "pt",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database (in real app, this would be a DB insert)
    mockTours.push(newTour);

    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
