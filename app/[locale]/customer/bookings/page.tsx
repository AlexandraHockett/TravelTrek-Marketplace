// File: app/[locale]/customer/bookings/page.tsx
// Location: SUBSTITUIR o ficheiro existente app/[locale]/customer/bookings/page.tsx

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import CustomerBookingsClient from "./client";
import { Booking } from "@/types";

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
    title: t.pages?.customerBookings?.title || "My Bookings",
    description:
      t.pages?.customerBookings?.description ||
      "Manage all your travel experience bookings",
  };
}

// Server Component principal
export default async function CustomerBookingsPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Mock data - CORRIGIDO com todas as propriedades necessárias
  const mockBookings: Booking[] = [
    {
      id: "b1",
      tourId: "t1",
      tourTitle: "Porto Food & Wine Tour",
      tourImage: "/images/tours/porto-food.webp",
      tourDescription: "bookingDetails.tourDescription.portoFoodWine",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h1",
      hostName: "Maria Santos",
      hostAvatar: "/images/avatars/host-maria.webp",
      hostEmail: "maria@host.com",
      hostPhone: "+351 912 345 678",
      hostVerified: true, // ✅ ADICIONADO
      hostResponseTime: "< 1 hora", // ✅ ADICIONADO
      date: "2025-09-15",
      time: "10:00", // ✅ ADICIONADO
      participants: 2,
      basePrice: 44.99, // ✅ ADICIONADO
      totalAmount: 89.98,
      serviceFees: 0, // ✅ ADICIONADO
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      specialRequests:
        "One participant is vegetarian, please provide suitable food options.",
      meetingPoint: "Mercado do Bolhão, Porto",
      cancellationPolicy:
        "Free cancellation up to 24 hours before the tour starts.",
      createdAt: "2025-08-20T10:00:00Z",
      updatedAt: "2025-08-20T10:00:00Z",
    },
    {
      id: "b2",
      tourId: "t2",
      tourTitle: "Sintra Royal Palaces",
      tourImage: "/images/tours/sintra-palace.webp",
      tourDescription: "bookingDetails.tourDescription.sintraPalaces",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h2",
      hostName: "Carlos Pereira",
      hostAvatar: "/images/avatars/host-carlos.webp",
      hostEmail: "carlos@host.com",
      hostPhone: "+351 913 456 789",
      hostVerified: true, // ✅ ADICIONADO
      hostResponseTime: "< 2 horas", // ✅ ADICIONADO
      date: "2025-09-22",
      time: "09:30", // ✅ ADICIONADO
      participants: 3,
      basePrice: 65.0, // ✅ ADICIONADO
      totalAmount: 195.0,
      serviceFees: 0, // ✅ ADICIONADO
      status: "pending" as const,
      paymentStatus: "pending" as const,
      specialRequests:
        "We would like to take lots of photos, please allow extra time.",
      meetingPoint: "Estação de Sintra, Largo da Estação",
      cancellationPolicy:
        "Free cancellation up to 48 hours before the tour starts.",
      createdAt: "2025-08-22T14:30:00Z",
      updatedAt: "2025-08-22T14:30:00Z",
    },
    {
      id: "b3",
      tourId: "t3",
      tourTitle: "Lisbon Sunset River Cruise",
      tourImage: "/images/tours/lisbon-sunset.webp",
      tourDescription: "bookingDetails.tourDescription.lisbonSunset",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h3",
      hostName: "Ana Costa",
      hostAvatar: "/images/avatars/host-ana.webp",
      hostEmail: "ana@host.com",
      hostPhone: "+351 914 567 890",
      hostVerified: true, // ✅ ADICIONADO
      hostResponseTime: "< 30 minutos", // ✅ ADICIONADO
      date: "2025-08-25",
      time: "18:00", // ✅ ADICIONADO
      participants: 2,
      basePrice: 35.0, // ✅ ADICIONADO
      totalAmount: 70.0,
      serviceFees: 0, // ✅ ADICIONADO
      status: "completed" as const,
      paymentStatus: "paid" as const,
      specialRequests: "",
      meetingPoint: "Cais do Sodré, Terminal de Cruzeiros",
      cancellationPolicy:
        "Free cancellation up to 12 hours before the tour starts.",
      createdAt: "2025-07-20T11:45:00Z",
      updatedAt: "2025-08-25T20:00:00Z",
    },
    {
      id: "b4",
      tourId: "t4",
      tourTitle: "Óbidos Medieval Village",
      tourImage: "/images/tours/obidos-medieval.webp",
      tourDescription: "bookingDetails.tourDescription.obidosMedieval",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h4",
      hostName: "Pedro Santos",
      hostAvatar: "/images/avatars/host-pedro.webp",
      hostEmail: "pedro@host.com",
      hostPhone: "+351 915 678 901",
      hostVerified: false, // ✅ ADICIONADO
      hostResponseTime: "< 4 horas", // ✅ ADICIONADO
      date: "2025-07-30",
      time: "14:00", // ✅ ADICIONADO
      participants: 1,
      basePrice: 35.0, // ✅ ADICIONADO
      totalAmount: 35.0,
      serviceFees: 0, // ✅ ADICIONADO
      status: "cancelled" as const,
      paymentStatus: "refunded" as const,
      specialRequests: "",
      meetingPoint: "Entrada Principal de Óbidos",
      cancellationPolicy: "Moderate cancellation policy applies.",
      createdAt: "2025-07-20T11:45:00Z",
      updatedAt: "2025-08-04T08:00:00Z",
    },
  ];

  return (
    <CustomerBookingsClient
      initialBookings={mockBookings}
      translations={t}
      locale={locale}
    />
  );
}
