// File: app/[locale]/customer/bookings/page.tsx
// Location: Substituir o ficheiro existente

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import CustomerBookingsClient from "./client";

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
    title: t.pages?.customerBookings?.title || "As Minhas Reservas",
    description:
      t.pages?.customerBookings?.description ||
      "Gere todas as suas reservas de experiências de viagem",
  };
}

// Server Component principal
export default async function CustomerBookingsPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Mock data - igual ao que tinhas mas com i18n
  const mockBookings = [
    {
      id: "b1",
      tourId: "t1",
      tourTitle: "Porto Food & Wine Tour",
      tourImage: "/images/tours/porto-food.webp",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h1",
      date: "2025-09-15",
      participants: 2,
      totalAmount: 89.98,
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      specialRequests: "bookingList.vegetarianRequest",
      createdAt: "2025-08-20T10:00:00Z",
      updatedAt: "2025-08-20T10:00:00Z",
    },
    {
      id: "b2",
      tourId: "t2",
      tourTitle: "Sintra Royal Palaces",
      tourImage: "/images/tours/sintra-palace.webp",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h2",
      date: "2025-09-22",
      participants: 3,
      totalAmount: 195.0,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      createdAt: "2025-08-22T14:30:00Z",
      updatedAt: "2025-08-22T14:30:00Z",
    },
    {
      id: "b3",
      tourId: "t3",
      tourTitle: "Douro Valley River Cruise",
      tourImage: "/images/tours/douro-cruise.webp",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h3",
      date: "2025-08-10",
      participants: 2,
      totalAmount: 178.0,
      status: "completed" as const,
      paymentStatus: "paid" as const,
      createdAt: "2025-07-25T09:15:00Z",
      updatedAt: "2025-08-11T16:00:00Z",
    },
    {
      id: "b4",
      tourId: "t4",
      tourTitle: "Lisbon Tuk-Tuk City Tour",
      tourImage: "/images/tours/lisbon-tuktuk.webp",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h4",
      date: "2025-08-05",
      participants: 1,
      totalAmount: 35.0,
      status: "cancelled" as const,
      paymentStatus: "refunded" as const,
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
