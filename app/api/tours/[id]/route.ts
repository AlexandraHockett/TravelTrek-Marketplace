// File: app/api/tours/[id]/route.ts
// Location: Create this NEW file in app/api/tours/[id]/

import { NextRequest, NextResponse } from "next/server";
import { Tour } from "@/types";

// Mock tours data
const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Passeio Histórico pelo Centro do Porto",
    description:
      "Descubra a história fascinante do Porto numa caminhada guiada pelos seus locais mais emblemáticos.",
    shortDescription: "Caminhada histórica pelo centro histórico do Porto",
    image: "/images/tours/porto-historic.webp",
    images: [
      "/images/tours/porto-historic.webp",
      "/images/tours/porto-cathedral.webp",
      "/images/tours/porto-tiles.webp",
      "/images/tours/porto-bridge.webp",
    ],
    price: 25.0,
    originalPrice: 35.0,
    currency: "EUR",
    duration: 3,
    location: "Porto, Portugal",
    rating: 4.8,
    reviewCount: 127,
    maxParticipants: 12,
    minimumAge: 8,
    difficulty: "Easy" as const,
    included: [
      "Guia turístico certificado",
      "Mapa da cidade",
      "Degustação de Francesinha",
      "Entrada na Sé do Porto",
    ],
    excluded: [
      "Transporte para o ponto de encontro",
      "Bebidas adicionais",
      "Gratificações",
    ],
    itinerary: [
      {
        time: "09:00",
        title: "Encontro na Estação de São Bento",
        description:
          "Início do tour com apresentação do guia e visão geral do percurso",
      },
      {
        time: "09:30",
        title: "Sé do Porto",
        description: "Visita à catedral e miradouro com vista sobre a cidade",
      },
      {
        time: "10:30",
        title: "Rua das Flores",
        description: "Caminhada pela rua mais pitoresca do centro histórico",
      },
      {
        time: "11:30",
        title: "Torre dos Clérigos",
        description: "Vista exterior e explicação histórica da torre",
      },
      {
        time: "12:00",
        title: "Degustação de Francesinha",
        description: "Prova do prato típico portuense num restaurante local",
      },
    ],
    cancellationPolicy: "flexible",
    hostId: "h1",
    tags: ["história", "caminhada", "cultura", "gastronomia"],
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-08-15T14:30:00.000Z",
  },
  {
    id: "t2",
    title: "Tour de Vinhos no Douro",
    description:
      "Experiência exclusiva de prova de vinhos nas quintas mais prestigiadas do Vale do Douro.",
    shortDescription: "Prova de vinhos no Douro com quintas tradicionais",
    image: "/images/tours/douro-wine.webp",
    images: [
      "/images/tours/douro-wine.webp",
      "/images/tours/douro-vineyard.webp",
      "/images/tours/douro-cellar.webp",
      "/images/tours/douro-landscape.webp",
    ],
    price: 85.0,
    currency: "EUR",
    duration: 8,
    location: "Vale do Douro, Portugal",
    rating: 4.9,
    reviewCount: 89,
    maxParticipants: 8,
    minimumAge: 18,
    difficulty: "Moderate" as const,
    included: [
      "Transporte em minibus de luxo",
      "Prova de vinhos em 3 quintas",
      "Almoço tradicional",
      "Guia especializado em vinhos",
      "Seguro de viagem",
    ],
    excluded: [
      "Compras adicionais de vinho",
      "Gratificações",
      "Bebidas no almoço (exceto vinho)",
    ],
    itinerary: [
      {
        time: "08:00",
        title: "Partida do Porto",
        description: "Encontro e partida rumo ao Vale do Douro",
      },
      {
        time: "10:00",
        title: "Quinta da Pacheca",
        description: "Primeira prova de vinhos e visita às instalações",
      },
      {
        time: "12:30",
        title: "Almoço tradicional",
        description: "Refeição com produtos locais e vista sobre o rio",
      },
      {
        time: "14:30",
        title: "Quinta do Bomfim",
        description: "Visita às caves e prova de vinhos premium",
      },
      {
        time: "16:00",
        title: "Miradouro de São Leonardo",
        description: "Vista panorâmica sobre o vale e sessão fotográfica",
      },
      {
        time: "17:00",
        title: "Regresso ao Porto",
        description: "Viagem de volta com paragens para fotografias",
      },
    ],
    cancellationPolicy: "moderate",
    hostId: "h2",
    tags: ["vinho", "gastronomia", "natureza", "luxo"],
    createdAt: "2024-02-01T09:00:00.000Z",
    updatedAt: "2024-08-20T11:15:00.000Z",
  },
  {
    id: "t3",
    title: "Aventura em Sintra: Palácios e Mistérios",
    description:
      "Explore os palácios mágicos de Sintra e descubra os seus segredos numa aventura única.",
    shortDescription: "Tour pelos palácios históricos de Sintra",
    image: "/images/tours/sintra-palace.webp",
    images: [
      "/images/tours/sintra-palace.webp",
      "/images/tours/sintra-pena.webp",
      "/images/tours/sintra-gardens.webp",
      "/images/tours/sintra-village.webp",
    ],
    price: 45.0,
    originalPrice: 55.0,
    currency: "EUR",
    duration: 6,
    location: "Sintra, Portugal",
    rating: 4.7,
    reviewCount: 203,
    maxParticipants: 15,
    minimumAge: 10,
    difficulty: "Moderate" as const,
    included: [
      "Entradas nos palácios",
      "Guia especializado em história",
      "Transporte local entre palácios",
      "Lanche tradicional",
      "Mapa e guia escrito",
    ],
    excluded: ["Transporte desde Lisboa", "Almoço completo", "Souvenirs"],
    itinerary: [
      {
        time: "09:30",
        title: "Encontro na Estação de Sintra",
        description: "Receção e briefing sobre o dia",
      },
      {
        time: "10:00",
        title: "Palácio da Pena",
        description: "Visita ao palácio mais emblemático de Sintra",
      },
      {
        time: "12:00",
        title: "Jardins do Palácio",
        description: "Caminhada pelos jardins românticos",
      },
      {
        time: "13:00",
        title: "Lanche em Sintra",
        description: "Prova de doces conventuais tradicionais",
      },
      {
        time: "14:00",
        title: "Quinta da Regaleira",
        description: "Exploração dos mistérios e símbolos esotéricos",
      },
      {
        time: "15:30",
        title: "Vila de Sintra",
        description: "Passeio pelo centro histórico e tempo livre",
      },
    ],
    cancellationPolicy: "flexible",
    hostId: "h3",
    tags: ["história", "palácios", "aventura", "cultura"],
    createdAt: "2024-01-20T08:30:00.000Z",
    updatedAt: "2024-08-18T16:45:00.000Z",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find tour by ID
    const tour = mockTours.find((t) => t.id === id);

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Add some extended properties for the UI
    const extendedTour = {
      ...tour,
      longDescription: `${tour.description} Esta experiência foi cuidadosamente desenhada para proporcionar uma imersão completa na cultura e história local, com atenção aos detalhes e conforto dos participantes.`,
      highlights: [
        "Guia local especializado",
        "Grupos pequenos para experiência personalizada",
        "Acesso a locais exclusivos",
        "Histórias e curiosidades únicas",
      ],
      languages: ["Português", "English"],
      hostName: `Anfitrião ${tour.hostId}`,
      hostResponseTime: "Responde normalmente em 2 horas",
      meetingPoint: getLocationMeetingPoint(tour.location),
      isBookmarked: false,
      availableDates: generateAvailableDates(),
      category: tour.tags[0] || "cultura",
    };

    return NextResponse.json(extendedTour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to generate available dates (next 30 days, excluding some)
function generateAvailableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    // Skip some random dates to simulate unavailability
    if (i % 7 !== 0 && i % 11 !== 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
}

// Helper function to get meeting point based on location
function getLocationMeetingPoint(location: string): string {
  if (location.includes("Porto")) {
    return "Estação de São Bento - Entrada principal";
  } else if (location.includes("Douro")) {
    return "Hotel Vila Galé Porto - Lobby";
  } else if (location.includes("Sintra")) {
    return "Estação de Comboios de Sintra - Saída principal";
  }
  return "Local a confirmar por mensagem";
}
