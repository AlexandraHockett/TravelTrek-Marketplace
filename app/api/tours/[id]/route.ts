// File: app/api/tours/[id]/route.ts
// Location: Create this file in app/api/tours/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Tour } from "@/types";

// Mock data - same as in the main tours route
const mockTours: Tour[] = [
  {
    id: "1",
    title: "Historic Porto Walking Tour",
    description:
      "Discover the beautiful historic center of Porto with a local guide. Visit the most iconic landmarks and learn about the rich history of this UNESCO World Heritage city.",
    shortDescription: "Explore Porto's historic center with a local guide",
    image: "/images/tours/porto-historic.jpg",
    images: [
      "/images/tours/porto-historic.jpg",
      "/images/tours/porto-historic-2.jpg",
      "/images/tours/porto-historic-3.jpg",
    ],
    price: 25,
    originalPrice: 35,
    currency: "EUR",
    duration: 3,
    location: "Porto, Portugal",
    rating: 4.8,
    reviewCount: 127,
    maxParticipants: 15,
    minimumAge: 8,
    difficulty: "Easy",
    included: [
      "Professional local guide",
      "Small group (max 15 people)",
      "Historical insights",
      "Photo opportunities",
    ],
    excluded: [
      "Food and drinks",
      "Transportation",
      "Entrance fees to monuments",
    ],
    itinerary: [
      {
        time: "09:00",
        title: "Meeting Point - Livraria Lello",
        description: "Meet your guide at the famous Livraria Lello bookstore",
      },
      {
        time: "09:15",
        title: "Clérigos Tower",
        description:
          "Visit the iconic baroque tower and learn about its history",
      },
      {
        time: "10:00",
        title: "São Bento Station",
        description:
          "Admire the beautiful azulejo tiles depicting Portuguese history",
      },
      {
        time: "10:45",
        title: "Porto Cathedral",
        description: "Explore one of the oldest monuments in the city",
      },
      {
        time: "11:30",
        title: "Ribeira District",
        description: "Walk through the colorful riverside district",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    hostId: "host-1",
    tags: ["history", "walking", "culture", "unesco"],
    language: "en",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Douro Valley Wine Experience",
    description:
      "Journey through the stunning Douro Valley, a UNESCO World Heritage site. Visit traditional quintas, taste world-famous Port wine, and enjoy breathtaking vineyard landscapes.",
    shortDescription: "Wine tasting in the beautiful Douro Valley",
    image: "/images/tours/douro-valley.jpg",
    images: [
      "/images/tours/douro-valley.jpg",
      "/images/tours/douro-valley-2.jpg",
      "/images/tours/douro-valley-3.jpg",
    ],
    price: 89,
    originalPrice: 120,
    currency: "EUR",
    duration: 8,
    location: "Douro Valley, Portugal",
    rating: 4.9,
    reviewCount: 203,
    maxParticipants: 8,
    minimumAge: 18,
    difficulty: "Easy",
    included: [
      "Transportation from Porto",
      "Wine tastings at 2 quintas",
      "Traditional Portuguese lunch",
      "Professional guide",
      "Small group experience",
    ],
    excluded: ["Additional wine purchases", "Personal expenses", "Gratuities"],
    itinerary: [
      {
        time: "08:30",
        title: "Departure from Porto",
        description: "Pick up from central meeting point in Porto",
      },
      {
        time: "10:00",
        title: "First Quinta Visit",
        description: "Tour the vineyards and taste premium wines",
      },
      {
        time: "12:30",
        title: "Traditional Lunch",
        description: "Enjoy a traditional Portuguese meal with wine pairing",
      },
      {
        time: "14:00",
        title: "Second Quinta Visit",
        description: "Learn about Port wine production and taste vintage ports",
      },
      {
        time: "16:00",
        title: "Scenic Drive",
        description: "Enjoy panoramic views of the Douro River and vineyards",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 48 hours before the experience starts",
    hostId: "host-2",
    tags: ["wine", "douro", "unesco", "food", "vineyards"],
    language: "en",
    createdAt: new Date("2024-01-02").toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Lisbon Tuk-Tuk Adventure",
    description:
      "Explore Lisbon's seven hills in a fun and eco-friendly tuk-tuk. Visit famous neighborhoods, enjoy panoramic viewpoints, and discover hidden gems with a local driver-guide.",
    shortDescription: "Fun tuk-tuk tour through Lisbon's hills",
    image: "/images/tours/lisbon-tuktuk.jpg",
    images: [
      "/images/tours/lisbon-tuktuk.jpg",
      "/images/tours/lisbon-tuktuk-2.jpg",
      "/images/tours/lisbon-tuktuk-3.jpg",
    ],
    price: 35,
    originalPrice: 45,
    currency: "EUR",
    duration: 2.5,
    location: "Lisbon, Portugal",
    rating: 4.7,
    reviewCount: 95,
    maxParticipants: 6,
    minimumAge: 5,
    difficulty: "Easy",
    included: [
      "Tuk-tuk transportation",
      "Local driver-guide",
      "Multiple photo stops",
      "Route through 5 neighborhoods",
    ],
    excluded: ["Food and drinks", "Entrance fees to monuments", "Hotel pickup"],
    itinerary: [
      {
        time: "14:00",
        title: "Rossio Square Meeting",
        description: "Meet your tuk-tuk driver at the central square",
      },
      {
        time: "14:15",
        title: "Alfama District",
        description:
          "Navigate the narrow streets of Lisbon's oldest neighborhood",
      },
      {
        time: "14:45",
        title: "Miradouro da Senhora do Monte",
        description: "Best panoramic view over Lisbon",
      },
      {
        time: "15:15",
        title: "Graça & Mouraria",
        description: "Discover authentic local neighborhoods",
      },
      {
        time: "15:45",
        title: "Chiado & Bairro Alto",
        description: "Trendy areas with great shopping and nightlife",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    hostId: "host-3",
    tags: ["tuktuk", "sightseeing", "neighborhoods", "viewpoints"],
    language: "en",
    createdAt: new Date("2024-01-03").toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - Fetch a specific tour by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    const tour = mockTours.find((tour) => tour.id === id);

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific tour (for hosts)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    const tourIndex = mockTours.findIndex((tour) => tour.id === id);

    if (tourIndex === -1) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Update tour fields
    const updatedTour = {
      ...mockTours[tourIndex],
      ...body,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };

    mockTours[tourIndex] = updatedTour;

    return NextResponse.json({
      tour: updatedTour,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific tour (for hosts)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    const tourIndex = mockTours.findIndex((tour) => tour.id === id);

    if (tourIndex === -1) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Remove tour from array
    mockTours.splice(tourIndex, 1);

    return NextResponse.json({
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
