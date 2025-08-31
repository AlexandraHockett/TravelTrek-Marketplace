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
    title: t("pages.customerBookings.title") || "My Bookings",
    description:
      t("pages.customerBookings.description") ||
      "Manage all your travel experience bookings",
  };
}

// Server Component principal
export default async function CustomerBookingsPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Mock data - atualizado para corresponder ao tipo Booking
  const mockBookings = [
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
      hostEmail: "maria@host.com",
      hostPhone: "+351 912 345 678",
      date: "2025-09-15",
      participants: 2,
      totalAmount: 89.98,
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      specialRequests: "bookingDetails.specialRequests.vegetarian",
      meetingPoint: "bookingDetails.meetingPointDetails.portoCathedral",
      cancellationPolicy: "bookingDetails.cancellationPolicyDetails.flexible",
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
      hostName: "Ana Costa",
      hostEmail: "ana@host.com",
      hostPhone: "+351 923 456 789",
      date: "2025-09-22",
      participants: 3,
      totalAmount: 195.0,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      specialRequests: undefined,
      meetingPoint: "bookingDetails.meetingPointDetails.sintraStation",
      cancellationPolicy: "bookingDetails.cancellationPolicyDetails.moderate",
      createdAt: "2025-08-22T14:30:00Z",
      updatedAt: "2025-08-22T14:30:00Z",
    },
    {
      id: "b3",
      tourId: "t3",
      tourTitle: "Douro Valley River Cruise",
      tourImage: "/images/tours/douro-cruise.webp",
      tourDescription: "bookingDetails.tourDescription.douroCruise",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h3",
      hostName: "Pedro Almeida",
      hostEmail: "pedro@host.com",
      hostPhone: "+351 934 567 890",
      date: "2025-08-10",
      participants: 2,
      totalAmount: 178.0,
      status: "completed" as const,
      paymentStatus: "paid" as const,
      specialRequests: undefined,
      meetingPoint: "bookingDetails.meetingPointDetails.douroPort",
      cancellationPolicy: "bookingDetails.cancellationPolicyDetails.strict",
      createdAt: "2025-07-25T09:15:00Z",
      updatedAt: "2025-08-11T16:00:00Z",
    },
    {
      id: "b4",
      tourId: "t4",
      tourTitle: "Lisbon Tuk-Tuk City Tour",
      tourImage: "/images/tours/lisbon-tuktuk.webp",
      tourDescription: "bookingDetails.tourDescription.lisbonTukTuk",
      customerId: "c1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      hostId: "h4",
      hostName: "Sofia Mendes",
      hostEmail: "sofia@host.com",
      hostPhone: "+351 945 678 901",
      date: "2025-08-05",
      participants: 1,
      totalAmount: 35.0,
      status: "cancelled" as const,
      paymentStatus: "refunded" as const,
      specialRequests: "bookingDetails.specialRequests.wheelchair",
      meetingPoint: "bookingDetails.meetingPointDetails.lisbonSquare",
      cancellationPolicy: "bookingDetails.cancellationPolicyDetails.flexible",
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
