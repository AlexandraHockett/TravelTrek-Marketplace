// File: app/[locale]/customer/tours/page.tsx
// Location: SUBSTITUIR o ficheiro existente

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import type { Tour } from "@/types";
import CustomerToursClient from "./client";

// Tipagem para os params
interface PageProps {
  params: Promise<{ locale: string }>;
}

// Função para resolver params
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Mock data - substituir por API real posteriormente
const createMockTours = (locale: string): Tour[] => [
  {
    id: "t1",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Porto Food & Wine Tour",
    description:
      "Embark on a culinary journey through Porto's historic streets and discover the authentic flavors of Portuguese cuisine. This guided tour takes you to family-run restaurants, traditional markets, and local wine bars where you'll sample the best of what Porto has to offer.",
    shortDescription: "Authentic Portuguese cuisine tour with wine tastings",
    image: "/images/tours/porto-food.webp",
    images: [
      "/images/tours/porto-food.webp",
      "/images/tours/porto-food-2.webp",
      "/images/tours/porto-food-3.webp",
    ],
    price: 45,
    originalPrice: 60,
    currency: "EUR",
    duration: 4,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 128,
    maxParticipants: 12,
    minimumAge: 18,
    difficulty: "Easy" as const,
    included: [
      "Professional local guide",
      "Food tastings at 5 different venues",
      "Port wine and green wine samples",
      "Traditional Portuguese dessert",
    ],
    excluded: [
      "Hotel pickup and drop-off",
      "Additional drinks beyond tastings",
      "Gratuities",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    hostId: "h1",
    tags: ["Food", "Wine", "Culture", "Walking"],
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2025-08-20T14:30:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "10:00",
        title: "Meeting Point",
        description: "Meet at Mercado do Bolhão entrance",
      },
      {
        time: "10:30",
        title: "Traditional Market",
        description: "Explore local produce and specialties",
      },
      {
        time: "11:30",
        title: "Wine Tasting",
        description: "Sample Port wines at traditional cellar",
      },
      {
        time: "13:00",
        title: "Local Restaurant",
        description: "Authentic Portuguese lunch experience",
      },
    ],
  },
  {
    id: "t2",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Sintra Royal Palaces",
    description:
      "Visit the majestic palaces of Sintra, UNESCO World Heritage site, with specialist guide. Explore the colorful Pena Palace and mysterious Quinta da Regaleira with its underground tunnels and mystical gardens.",
    shortDescription: "Royal palaces and mystical gardens tour",
    image: "/images/tours/sintra-palace.webp",
    images: [
      "/images/tours/sintra-palace.webp",
      "/images/tours/sintra-palace-2.webp",
      "/images/tours/quinta-regaleira.webp",
    ],
    price: 65,
    originalPrice: 80,
    currency: "EUR",
    duration: 8,
    location: "Sintra, Portugal",
    rating: 4.8,
    reviewCount: 156,
    maxParticipants: 12,
    minimumAge: 8,
    difficulty: "Moderate" as const,
    included: [
      "Professional guide",
      "Transportation from Sintra station",
      "Palace entrance tickets",
      "Traditional Portuguese snack",
    ],
    excluded: ["Train ticket to Sintra", "Lunch", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 48 hours before the tour",
    hostId: "h2",
    tags: ["Culture", "History", "Architecture", "UNESCO"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "09:00",
        title: "Sintra Station",
        description: "Meet at Sintra train station",
      },
      {
        time: "09:30",
        title: "Pena Palace",
        description: "Explore the colorful romantic palace",
      },
      {
        time: "12:00",
        title: "Sintra Village",
        description: "Traditional lunch break and exploration",
      },
      {
        time: "14:00",
        title: "Quinta da Regaleira",
        description: "Discover mystical gardens and underground tunnels",
      },
    ],
  },
  {
    id: "t3",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Douro Valley River Cruise",
    description:
      "Sail through the breathtaking Douro Valley, a UNESCO World Heritage landscape of terraced vineyards. Enjoy wine tastings at renowned quintas while admiring the spectacular river views and century-old traditions.",
    shortDescription: "Scenic river cruise with wine tastings",
    image: "/images/tours/douro-cruise.webp",
    images: [
      "/images/tours/douro-cruise.webp",
      "/images/tours/douro-valley.webp",
      "/images/tours/douro-vineyards.webp",
    ],
    price: 89,
    originalPrice: 110,
    currency: "EUR",
    duration: 10,
    location: "Douro Valley, Portugal",
    rating: 4.9,
    reviewCount: 203,
    maxParticipants: 18,
    minimumAge: 12,
    difficulty: "Easy" as const,
    included: [
      "River cruise boat",
      "Professional wine guide",
      "Wine tastings at 2 quintas",
      "Traditional lunch with regional specialties",
      "Transportation from Porto",
    ],
    excluded: ["Additional wine purchases", "Personal expenses", "Gratuities"],
    cancellationPolicy: "Free cancellation up to 72 hours before the tour",
    hostId: "h3",
    tags: ["Wine", "Nature", "Cruise", "UNESCO", "Food"],
    createdAt: "2025-07-20T00:00:00Z",
    updatedAt: "2025-08-10T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "08:30",
        title: "Porto Departure",
        description: "Pickup from central Porto locations",
      },
      {
        time: "10:00",
        title: "Régua Embarkation",
        description: "Board the cruise boat at Peso da Régua",
      },
      {
        time: "10:30",
        title: "River Cruise",
        description: "Scenic cruise through terraced vineyards",
      },
      {
        time: "12:30",
        title: "Quinta Wine Tasting",
        description: "First wine tasting with regional cheeses",
      },
      {
        time: "14:00",
        title: "Traditional Lunch",
        description: "Regional lunch at riverside quinta",
      },
      {
        time: "16:00",
        title: "Second Quinta",
        description: "Visit another wine estate for tastings",
      },
      {
        time: "17:30",
        title: "Return to Porto",
        description: "Comfortable return journey",
      },
    ],
  },
  {
    id: "t4",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Lisbon Tuk-Tuk City Tour",
    description:
      "Explore Lisbon's seven hills and historic neighborhoods in an eco-friendly tuk-tuk. Discover hidden viewpoints, traditional Fado houses, and colorful azulejo tiles while learning about the city's rich history and vibrant culture.",
    shortDescription: "Historic city tour by tuk-tuk",
    image: "/images/tours/lisbon-tuktuk.webp",
    images: [
      "/images/tours/lisbon-tuktuk.webp",
      "/images/tours/lisbon-viewpoints.webp",
      "/images/tours/lisbon-azulejos.webp",
    ],
    price: 35,
    currency: "EUR",
    duration: 3,
    location: "Lisbon, Portugal",
    rating: 4.7,
    reviewCount: 89,
    maxParticipants: 6,
    minimumAge: 5,
    difficulty: "Easy" as const,
    included: [
      "Eco-friendly tuk-tuk transportation",
      "Professional local guide",
      "Photo stops at best viewpoints",
      "Traditional Portuguese pastéis de nata tasting",
    ],
    excluded: [
      "Hotel pickup and drop-off",
      "Entry tickets to monuments",
      "Additional food and drinks",
    ],
    cancellationPolicy: "Free cancellation up to 2 hours before the tour",
    hostId: "h4",
    tags: ["City Tour", "History", "Culture", "Eco-friendly"],
    createdAt: "2025-07-10T00:00:00Z",
    updatedAt: "2025-08-05T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "14:00",
        title: "Meeting Point",
        description: "Meet at Rossio Square",
      },
      {
        time: "14:15",
        title: "Alfama District",
        description: "Explore the oldest neighborhood with Fado history",
      },
      {
        time: "15:00",
        title: "Viewpoint São Jorge",
        description: "Panoramic views over the city and Tagus river",
      },
      {
        time: "15:30",
        title: "Chiado & Bairro Alto",
        description: "Historic shopping and nightlife districts",
      },
      {
        time: "16:15",
        title: "Pastéis de Belém",
        description: "Traditional custard tart tasting",
      },
    ],
  },
  {
    id: "t5",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Aveiro Salt Flats & Canals",
    description:
      "Discover the 'Venice of Portugal' with its colorful boats and Art Nouveau architecture. Visit traditional salt flats, learn about salt harvesting, and enjoy a peaceful boat ride through the scenic canals of the Ria de Aveiro.",
    shortDescription: "Salt flats and canals exploration",
    image: "/images/tours/aveiro-canals.webp",
    images: [
      "/images/tours/aveiro-canals.webp",
      "/images/tours/aveiro-salt.webp",
      "/images/tours/aveiro-boats.webp",
    ],
    price: 42,
    originalPrice: 55,
    currency: "EUR",
    duration: 5,
    location: "Aveiro, Portugal",
    rating: 4.6,
    reviewCount: 67,
    maxParticipants: 10,
    minimumAge: 6,
    difficulty: "Easy" as const,
    included: [
      "Traditional moliceiro boat ride",
      "Salt flats guided visit",
      "Salt harvesting demonstration",
      "Traditional ovos moles tasting",
    ],
    excluded: ["Transportation to Aveiro", "Lunch", "Personal purchases"],
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    hostId: "h5",
    tags: ["Nature", "Culture", "Boat Tour", "Traditional Crafts"],
    createdAt: "2025-07-15T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "10:00",
        title: "Aveiro City Center",
        description: "Meet at the colorful houses of Costa Nova",
      },
      {
        time: "10:30",
        title: "Moliceiro Boat Tour",
        description: "Traditional boat ride through the canals",
      },
      {
        time: "12:00",
        title: "Salt Flats Visit",
        description: "Learn traditional salt harvesting methods",
      },
      {
        time: "13:30",
        title: "Art Nouveau Walking",
        description: "Discover beautiful Art Nouveau buildings",
      },
      {
        time: "14:30",
        title: "Ovos Moles Tasting",
        description: "Try the famous local sweet delicacy",
      },
    ],
  },
];

// Metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;
  const t = await getTranslations(locale);

  return {
    title: t.pages?.customerTours?.title || "Tours & Experiences",
    description:
      t.pages?.customerTours?.description ||
      "Discover amazing tours and experiences",
  };
}

// Server Component principal
export default async function CustomerToursPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Mock data com propriedade language
  const tours = createMockTours(locale);

  // Props para o Client Component - CORRIGIDO: usar initialTours
  return (
    <CustomerToursClient
      initialTours={tours} // ✅ CORRIGIDO: era 'tours', agora é 'initialTours'
      translations={t}
      locale={locale}
    />
  );
}
