// File: app/[locale]/customer/tours/page.tsx
// Location: Criar novo ficheiro

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import type { Tour } from "@/types";
import CustomerToursClient from "./client";

// Mock data - substituir por API real posteriormente
const mockTours: Tour[] = [
  {
    id: "t1",
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
  },
  {
    id: "t2",
    title: "Sintra Royal Palaces",
    description:
      "Visit the majestic palaces of Sintra, UNESCO World Heritage site, with specialist guide. Explore the colorful Pena Palace and mysterious Quinta da Regaleira with its underground tunnels and mystical gardens.",
    shortDescription: "UNESCO palaces tour with skip-the-line access",
    image: "/images/tours/sintra-palace.webp",
    images: [
      "/images/tours/sintra-palace.webp",
      "/images/tours/sintra-palace-2.webp",
    ],
    price: 65,
    currency: "EUR",
    duration: 8,
    location: "Sintra, Portugal",
    rating: 4.7,
    reviewCount: 89,
    maxParticipants: 15,
    minimumAge: 10,
    difficulty: "Moderate" as const,
    included: [
      "Professional guide",
      "Skip-the-line tickets",
      "Transportation between palaces",
      "Quinta da Regaleira entrance",
    ],
    excluded: ["Lunch", "Hotel pickup", "Pena Palace interior (optional)"],
    cancellationPolicy: "Free cancellation up to 48 hours before the tour",
    hostId: "h2",
    tags: ["History", "Architecture", "UNESCO", "Culture"],
    createdAt: "2025-08-10T09:00:00Z",
    updatedAt: "2025-08-18T16:15:00Z",
  },
  {
    id: "t3",
    title: "Douro Valley River Cruise",
    description:
      "Panoramic cruise along the Douro River with stunning vineyard landscapes. Includes wine tasting at a traditional quinta and traditional Portuguese lunch with river views.",
    shortDescription: "Scenic river cruise with wine tasting and lunch",
    image: "/images/tours/douro-cruise.webp",
    images: [
      "/images/tours/douro-cruise.webp",
      "/images/tours/douro-valley.webp",
    ],
    price: 89,
    currency: "EUR",
    duration: 6,
    location: "Douro Valley, Portugal",
    rating: 4.8,
    reviewCount: 156,
    maxParticipants: 20,
    minimumAge: 16,
    difficulty: "Easy" as const,
    included: [
      "River cruise",
      "Wine tasting at quinta",
      "Traditional Portuguese lunch",
      "Professional guide",
    ],
    excluded: ["Hotel transfers", "Additional drinks", "Souvenirs"],
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    hostId: "h3",
    tags: ["Wine", "Nature", "Cruise", "Gastronomy"],
    createdAt: "2025-08-05T11:30:00Z",
    updatedAt: "2025-08-15T13:45:00Z",
  },
  {
    id: "t4",
    title: "Lisbon Tuk-Tuk City Tour",
    description:
      "Explore Lisbon in a fun tuk-tuk, discovering hidden corners of the city. Visit the most iconic neighborhoods including Alfama, Bairro Alto, and Belém with stops at major monuments.",
    shortDescription: "Fun tuk-tuk tour of Lisbon's highlights",
    image: "/images/tours/lisbon-tuktuk.webp",
    images: [
      "/images/tours/lisbon-tuktuk.webp",
      "/images/tours/lisbon-view.webp",
    ],
    price: 35,
    currency: "EUR",
    duration: 3,
    location: "Lisbon, Portugal",
    rating: 4.6,
    reviewCount: 203,
    maxParticipants: 6,
    minimumAge: 8,
    difficulty: "Easy" as const,
    included: [
      "Tuk-tuk transportation",
      "Professional driver-guide",
      "Multiple photo stops",
      "Route through 7 neighborhoods",
    ],
    excluded: ["Monument entrances", "Food and drinks", "Hotel pickup"],
    cancellationPolicy: "Free cancellation up to 2 hours before the tour",
    hostId: "h4",
    tags: ["City Tour", "Sightseeing", "Photography", "Adventure"],
    createdAt: "2025-07-25T14:20:00Z",
    updatedAt: "2025-08-12T10:10:00Z",
  },
  {
    id: "t5",
    title: "Óbidos Medieval Village",
    description:
      "Step back in time in the enchanting medieval village of Óbidos. Walk along ancient walls, visit the castle, and taste the famous Ginja liqueur in chocolate cups.",
    shortDescription: "Medieval village tour with castle and local tastings",
    image: "/images/tours/obidos-medieval.webp",
    images: [
      "/images/tours/obidos-medieval.webp",
      "/images/tours/obidos-walls.webp",
    ],
    price: 42,
    currency: "EUR",
    duration: 5,
    location: "Óbidos, Portugal",
    rating: 4.5,
    reviewCount: 67,
    maxParticipants: 10,
    minimumAge: 12,
    difficulty: "Moderate" as const,
    included: [
      "Guided walking tour",
      "Castle entrance",
      "Ginja tasting",
      "Historical commentary",
    ],
    excluded: ["Transportation to Óbidos", "Lunch", "Souvenir shopping"],
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    hostId: "h5",
    tags: ["History", "Medieval", "Culture", "Walking"],
    createdAt: "2025-08-01T12:00:00Z",
    updatedAt: "2025-08-08T15:30:00Z",
  },
  {
    id: "t6",
    title: "Cascais & Estoril Coastal Tour",
    description:
      "Discover the elegant coastal towns of Cascais and Estoril. Visit beautiful beaches, historic sites, and the famous casino. Perfect combination of relaxation and sightseeing.",
    shortDescription: "Coastal tour of Portugal's riviera",
    image: "/images/tours/cascais-coast.webp",
    images: [
      "/images/tours/cascais-coast.webp",
      "/images/tours/estoril-casino.webp",
    ],
    price: 55,
    currency: "EUR",
    duration: 4.5,
    location: "Cascais, Portugal",
    rating: 4.4,
    reviewCount: 91,
    maxParticipants: 12,
    minimumAge: 6,
    difficulty: "Easy" as const,
    included: [
      "Professional guide",
      "Beach visits",
      "Casino exterior tour",
      "Local market visit",
    ],
    excluded: ["Casino entrance", "Beach equipment", "Meals and drinks"],
    cancellationPolicy: "Free cancellation up to 12 hours before the tour",
    hostId: "h6",
    tags: ["Beach", "Coast", "Relaxation", "Sightseeing"],
    createdAt: "2025-07-30T16:45:00Z",
    updatedAt: "2025-08-05T09:20:00Z",
  },
];

// Tipagem para os params
interface PageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

// Função para resolver params
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;
  const t = await getTranslations(locale);

  return {
    title: t.pages?.customerTours?.title || "Tours e Experiências",
    description:
      t.pages?.customerTours?.description ||
      "Descubra experiências únicas em Portugal com anfitriões locais verificados",
  };
}

// Server Component principal
export default async function CustomerToursPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  return (
    <CustomerToursClient
      initialTours={mockTours}
      translations={t}
      locale={locale}
    />
  );
}
