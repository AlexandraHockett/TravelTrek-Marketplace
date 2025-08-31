// File: app/[locale]/customer/tours/[id]/page.tsx
// Location: CREATE this NEW file in app/[locale]/customer/tours/[id]/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "@/lib/utils";
import { Tour } from "@/types";
import TourDetailClient from "./client";

// Mock tours data - seguindo padrão exacto das bookings
const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Descoberta Gastronómica no Porto",
    description:
      "Embarque numa jornada gastronómica única pelas ruas históricas do Porto. Descubra os sabores autênticos da cidade enquanto exploramos mercados tradicionais, tascas locais e restaurantes famosos. Esta experiência combina história, cultura e gastronomia numa aventura inesquecível que o deixará com memórias duradouras da rica herança culinária portuense.",
    shortDescription:
      "Experiência gastronómica autêntica pelas ruas do Porto com degustações e visitas a locais históricos.",
    image: "/images/tours/porto-food.webp",
    images: [
      "/images/tours/porto-food.webp",
      "/images/tours/porto-market.webp",
      "/images/tours/porto-wine.webp",
    ],
    price: 65,
    originalPrice: 85,
    currency: "EUR",
    duration: 4,
    location: "Porto, Portugal",
    rating: 4.8,
    reviewCount: 127,
    maxParticipants: 12,
    minimumAge: 16,
    difficulty: "Easy",
    included: [
      "Guia local experiente",
      "Degustação em 5 locais diferentes",
      "Prova de vinhos do Porto",
      "Mapa e material informativo",
      "Seguro de responsabilidade civil",
    ],
    excluded: [
      "Transporte para o ponto de encontro",
      "Refeições principais",
      "Bebidas adicionais",
      "Gratificações",
    ],
    itinerary: [
      {
        time: "09:00",
        title: "Encontro na Livraria Lello",
        description:
          "Início do tour com apresentações e briefing sobre a experiência gastronómica.",
      },
      {
        time: "09:30",
        title: "Mercado do Bolhão",
        description:
          "Visita ao mercado tradicional com degustação de produtos locais.",
      },
      {
        time: "11:00",
        title: "Rua de Santa Catarina",
        description:
          "Caminhada pela rua comercial com paragem numa pastelaria histórica.",
      },
      {
        time: "12:30",
        title: "Cais da Ribeira",
        description:
          "Exploração da zona ribeirinha com almoço ligeiro numa tasca tradicional.",
      },
      {
        time: "14:00",
        title: "Cave de Vinho do Porto",
        description:
          "Visita a uma cave em Vila Nova de Gaia com prova de vinhos.",
      },
    ],
    cancellationPolicy:
      "Cancelamento gratuito até 24 horas antes do início da experiência.",
    hostId: "h1",
    tags: ["gastronomia", "cultura", "vinho", "história", "porto"],
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-31T14:30:00Z",
  },
  {
    id: "t2",
    title: "Caminhada pela Serra da Estrela",
    description:
      "Explore as paisagens deslumbrantes da Serra da Estrela numa caminhada guiada por trilhos ancestrais. Descubra a flora e fauna locais, desfrute de vistas panorâmicas únicas e mergulhe nas tradições serranas numa aventura que combina natureza, cultura e história.",
    shortDescription:
      "Aventura na natureza na montanha mais alta de Portugal continental.",
    image: "/images/tours/serra-estrela.webp",
    images: [
      "/images/tours/serra-estrela.webp",
      "/images/tours/serra-lagoa.webp",
    ],
    price: 45,
    currency: "EUR",
    duration: 6,
    location: "Serra da Estrela, Portugal",
    rating: 4.6,
    reviewCount: 89,
    maxParticipants: 8,
    minimumAge: 12,
    difficulty: "Moderate",
    included: [
      "Guia de montanha experiente",
      "Equipamento de segurança",
      "Lanche tradicional serrano",
      "Seguro de atividades de montanha",
    ],
    excluded: [
      "Transporte até ao ponto de encontro",
      "Equipamento pessoal de caminhada",
      "Refeições adicionais",
    ],
    itinerary: [
      {
        time: "08:00",
        title: "Encontro em Seia",
        description: "Briefing de segurança e distribuição do equipamento.",
      },
      {
        time: "09:00",
        title: "Início da Caminhada",
        description:
          "Partida para os trilhos da Serra com explicação da flora local.",
      },
      {
        time: "12:00",
        title: "Ponto Panorâmico",
        description: "Pausa para almoço com vista sobre o vale e Torre.",
      },
      {
        time: "14:30",
        title: "Regresso",
        description:
          "Descida pelos trilhos tradicionais com paragens fotográficas.",
      },
    ],
    cancellationPolicy:
      "Cancelamento gratuito até 48 horas antes. Dependente das condições meteorológicas.",
    hostId: "h2",
    tags: ["natureza", "caminhada", "aventura", "montanha", "serra"],
    createdAt: "2025-08-25T16:00:00Z",
    updatedAt: "2025-08-30T10:15:00Z",
  },
  {
    id: "t3",
    title: "Tour Histórico por Óbidos",
    description:
      "Viaje no tempo através das muralhas medievais de Óbidos. Conheça a história fascinante desta vila medieval, explore o castelo, caminhe pelas ruas de pedra e desfrute da famosa ginjinha servida em copos de chocolate.",
    shortDescription:
      "Descoberta histórica numa vila medieval portuguesa perfeitamente preservada.",
    image: "/images/tours/obidos-castle.webp",
    images: [
      "/images/tours/obidos-castle.webp",
      "/images/tours/obidos-street.webp",
    ],
    price: 35,
    originalPrice: 45,
    currency: "EUR",
    duration: 3,
    location: "Óbidos, Portugal",
    rating: 4.9,
    reviewCount: 156,
    maxParticipants: 15,
    difficulty: "Easy",
    included: [
      "Guia histórico especializado",
      "Entrada no castelo e muralhas",
      "Prova de ginjinha tradicional",
      "Mapa histórico da vila",
    ],
    excluded: ["Transporte até Óbidos", "Refeições", "Souvenirs"],
    itinerary: [
      {
        time: "14:00",
        title: "Porta da Vila",
        description: "Entrada pela porta principal com introdução histórica.",
      },
      {
        time: "14:30",
        title: "Rua Direita",
        description:
          "Caminhada pela rua principal com paragens em pontos de interesse.",
      },
      {
        time: "15:30",
        title: "Castelo de Óbidos",
        description:
          "Visita ao castelo com acesso às muralhas e vistas panorâmicas.",
      },
      {
        time: "16:30",
        title: "Degustação de Ginjinha",
        description: "Prova da bebida tradicional e tempo livre para compras.",
      },
    ],
    cancellationPolicy: "Cancelamento gratuito até 24 horas antes do início.",
    hostId: "h3",
    tags: ["história", "cultura", "medieval", "castelo", "patrimonio"],
    createdAt: "2025-08-28T09:00:00Z",
    updatedAt: "2025-08-31T11:45:00Z",
  },
];

// Tipagem para os params - MESMO PADRÃO das bookings
interface PageProps {
  params:
    | Promise<{ locale: string; id: string }>
    | { locale: string; id: string };
}

// Função para resolver params - IDÊNTICA às bookings
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Metadata dinâmica - SEGUINDO PADRÃO EXACTO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;
  const t = await getTranslations(locale);

  // Buscar tour para título específico
  const tour = mockTours.find((t) => t.id === id);

  if (!tour) {
    return {
      title: t.pages?.notFound?.title || "Página não encontrada",
      description:
        t.pages?.notFound?.description ||
        "A página solicitada não foi encontrada",
    };
  }

  return {
    title: `${tour.title} | TravelTrek`,
    description: tour.shortDescription || tour.description.substring(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.shortDescription || tour.description.substring(0, 160),
      images: [
        {
          url: tour.image,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
    },
  };
}

// Server Component principal - ESTRUTURA IDÊNTICA
export default async function TourDetailPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Buscar tour específico - substituir por API real
  const tour = mockTours.find((t) => t.id === id);

  if (!tour) {
    notFound();
  }

  return <TourDetailClient tour={tour} translations={t} locale={locale} />;
}
