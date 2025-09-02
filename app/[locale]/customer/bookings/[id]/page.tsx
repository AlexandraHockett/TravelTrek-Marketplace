// File: app/[locale]/customer/bookings/[id]/page.tsx
// Location: Substituir o ficheiro existente

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "@/lib/utils";
import type { Booking } from "@/types";
import BookingDetailClient from "./client";

// ✅ CORRIGIDO: Mock data com todas as propriedades necessárias
const mockBookings: Booking[] = [
  {
    id: "b1",
    userId: "c1", // ✅ ADICIONADO
    location: "Porto, Portugal", // ✅ ADICIONADO
    duration: 4, // ✅ ADICIONADO (horas)
    customerPhone: "+351 912 345 000", // ✅ ADICIONADO
    tourId: "t1",
    tourTitle: "Porto Food & Wine Tour",
    tourImage: "/images/tours/porto-food.webp",
    tourDescription: "bookingDetails.tourDescription.portoFoodWine",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h1",
    hostName: "Maria Santos",
    hostPhone: "+351 912 345 678",
    hostEmail: "maria@traveltrek.com",
    hostAvatar: "/images/avatars/host-avatar.webp",
    hostResponseTime: "< 1 hora",
    hostVerified: true,
    date: "2025-09-15",
    time: "14:30",
    participants: 2,
    totalAmount: 89.98,
    totalPrice: 89.98, // ✅ ADICIONADO
    currency: "EUR", // ✅ ADICIONADO
    basePrice: 44.99,
    serviceFees: 0.0,
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    specialRequests: "bookingDetails.specialRequests.vegetarian",
    meetingPoint: "bookingDetails.meetingPointDetails.portoCathedral",
    cancellationPolicy: "bookingDetails.cancellationPolicyDetails.moderate",
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "b2",
    userId: "c1", // ✅ ADICIONADO
    location: "Sintra, Portugal", // ✅ ADICIONADO
    duration: 6, // ✅ ADICIONADO (horas)
    customerPhone: "+351 912 345 000", // ✅ ADICIONADO
    tourId: "t2",
    tourTitle: "Sintra Royal Palaces",
    tourImage: "/images/tours/sintra-palace.webp",
    tourDescription: "bookingDetails.tourDescription.sintraPalaces",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h2",
    hostName: "Pedro Costa",
    hostPhone: "+351 923 456 789",
    hostEmail: "pedro@traveltrek.com",
    hostAvatar: "/images/avatars/host-pedro.webp",
    hostResponseTime: "< 2 horas",
    hostVerified: true,
    date: "2025-09-22",
    time: "09:00",
    participants: 3,
    totalAmount: 195.0,
    totalPrice: 195.0, // ✅ ADICIONADO
    currency: "EUR", // ✅ ADICIONADO
    basePrice: 65.0,
    serviceFees: 0.0,
    status: "pending" as const,
    paymentStatus: "pending" as const,
    meetingPoint: "bookingDetails.meetingPointDetails.sintraStation",
    cancellationPolicy: "bookingDetails.cancellationPolicyDetails.strict",
    createdAt: "2025-08-22T14:30:00Z",
    updatedAt: "2025-08-22T14:30:00Z",
  },
  {
    id: "b3",
    userId: "c1", // ✅ ADICIONADO
    location: "Douro Valley, Portugal", // ✅ ADICIONADO
    duration: 8, // ✅ ADICIONADO (horas)
    customerPhone: "+351 912 345 000", // ✅ ADICIONADO
    tourId: "t3",
    tourTitle: "Douro Valley River Cruise",
    tourImage: "/images/tours/douro-cruise.webp",
    tourDescription: "bookingDetails.tourDescription.douroCruise",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h3",
    hostName: "Ana Ferreira",
    hostPhone: "+351 934 567 890",
    hostEmail: "ana@traveltrek.com",
    hostAvatar: "/images/avatars/host-ana.webp",
    hostResponseTime: "< 30 min",
    hostVerified: true,
    date: "2025-08-10",
    time: "10:00",
    participants: 2,
    totalAmount: 178.0,
    totalPrice: 178.0, // ✅ ADICIONADO
    currency: "EUR", // ✅ ADICIONADO
    basePrice: 89.0,
    serviceFees: 0.0,
    status: "completed" as const,
    paymentStatus: "paid" as const,
    specialRequests: "bookingDetails.specialRequests.wheelchair",
    meetingPoint: "bookingDetails.meetingPointDetails.douroPort",
    cancellationPolicy: "bookingDetails.cancellationPolicyDetails.flexible",
    createdAt: "2025-07-25T09:15:00Z",
    updatedAt: "2025-08-11T16:00:00Z",
  },
  {
    id: "b4",
    userId: "c1", // ✅ ADICIONADO
    location: "Lisbon, Portugal", // ✅ ADICIONADO
    duration: 3, // ✅ ADICIONADO (horas)
    customerPhone: "+351 912 345 000", // ✅ ADICIONADO
    tourId: "t4",
    tourTitle: "Lisbon Tuk-Tuk City Tour",
    tourImage: "/images/tours/lisbon-tuktuk.webp",
    tourDescription: "bookingDetails.tourDescription.lisbonTukTuk",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h4",
    hostName: "Ricardo Silva",
    hostPhone: "+351 945 678 901",
    hostEmail: "ricardo@traveltrek.com",
    hostAvatar: "/images/avatars/host-ricardo.webp",
    hostResponseTime: "< 1 hora",
    hostVerified: true,
    date: "2025-08-05",
    time: "16:00",
    participants: 1,
    totalAmount: 35.0,
    totalPrice: 35.0, // ✅ ADICIONADO
    currency: "EUR", // ✅ ADICIONADO
    basePrice: 35.0,
    serviceFees: 0.0,
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    meetingPoint: "bookingDetails.meetingPointDetails.lisbonSquare",
    cancellationPolicy: "bookingDetails.cancellationPolicyDetails.moderate",
    createdAt: "2025-07-20T11:45:00Z",
    updatedAt: "2025-08-04T08:00:00Z",
  },
];

// Tipagem para os params
interface PageProps {
  params:
    | Promise<{ locale: string; id: string }>
    | { locale: string; id: string };
}

// Função para resolver params
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Metadata dinâmica
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;
  const t = await getTranslations(locale);

  // Buscar booking para título específico
  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    return {
      title: t.pages?.notFound?.title || "Página não encontrada",
      description:
        t.pages?.notFound?.description ||
        "A página solicitada não foi encontrada",
    };
  }

  return {
    title: `${t.pages?.bookingDetail?.title || "Detalhes da Reserva"} - ${booking.tourTitle}`,
    description:
      t.pages?.bookingDetail?.description ||
      `Detalhes da sua reserva para ${booking.tourTitle}`,
  };
}

// Server Component principal
export default async function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Buscar reserva específica - substituir por API real
  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    notFound();
  }

  return (
    <BookingDetailClient booking={booking} translations={t} locale={locale} />
  );
}
