// ===================================================================
// 📁 app/[locale]/admin/page.tsx
// Location: ALTERNATIVA COM BASE DE DADOS REAL
// Usar esta versão quando quiseres integrar com a base de dados
// ===================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { getServerTranslations } from "@/lib/server-translations";
import AdminDashboardClient from "./client";
// Descomenta estas linhas quando tiveres as queries prontas:
// import { bookingQueries } from "@/lib/db/queries/bookings";
// import { userQueries } from "@/lib/db/queries/users";
// import { tourQueries } from "@/lib/db/queries/tours";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const t = await getServerTranslations(locale);
  const user = await getCurrentUser();

  // Verificar se o usuário é admin
  if (!user || user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  // VERSÃO COM BASE DE DADOS REAL (descomentar quando estiver pronto):
  /*
  try {
    // Buscar estatísticas da base de dados
    const [
      allBookings,
      pendingBookingsList,
      allUsers,
      allHosts,
      allTours,
      monthlyBookings
    ] = await Promise.all([
      bookingQueries.getAll(),
      bookingQueries.getByStatus("pending"),
      userQueries.getAll(),
      userQueries.getByRole("host"),
      tourQueries.getAll(),
      bookingQueries.getMonthlyBookings()
    ]);

    // Calcular receita mensal
    const monthlyRevenue = monthlyBookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, booking) => sum + parseFloat(booking.totalPrice || "0"), 0);

    const stats = {
      totalBookings: allBookings.length,
      pendingBookings: pendingBookingsList.length,
      totalUsers: allUsers.length,
      totalHosts: allHosts.length,
      totalTours: allTours.length,
      monthlyRevenue: monthlyRevenue,
    };

    // Buscar detalhes dos bookings pendentes com informação adicional
    const recentPendingBookings = await Promise.all(
      pendingBookingsList.slice(0, 10).map(async (booking) => {
        const tour = await tourQueries.getById(booking.tourId);
        const host = await userQueries.getById(booking.hostId);
        
        return {
          ...booking,
          tourTitle: tour?.title || "Unknown Tour",
          tourLocation: tour?.location || "Unknown",
          hostName: host?.name || "Unknown Host",
        };
      })
    );

    return (
      <AdminDashboardClient
        locale={locale}
        translations={t}
        user={user}
        stats={stats}
        recentPendingBookings={recentPendingBookings}
      />
    );
  } catch (error) {
    console.error("Error loading admin dashboard data:", error);
    // Fallback para dados mock em caso de erro
  }
  */

  // DADOS MOCK (remover quando a integração com DB estiver pronta)
  const stats = {
    totalBookings: 47,
    pendingBookings: 5,
    totalUsers: 123,
    totalHosts: 18,
    totalTours: 32,
    monthlyRevenue: 15480,
  };

  const recentPendingBookings = [
    {
      id: "booking-1",
      tourId: "tour-1",
      customerId: "customer-1",
      customerName: "João Silva",
      customerEmail: "joao@example.com",
      date: "2025-02-15",
      time: "10:00",
      participants: 2,
      totalPrice: "150",
      status: "pending",
      specialRequests:
        "Gostaríamos de ter um guia que fale português. Minha esposa tem alergia a frutos do mar.",
      createdAt: new Date().toISOString(),
      tourTitle: "Porto Historic Walking Tour",
      tourLocation: "Porto",
      hostName: "Maria Santos",
    },
    {
      id: "booking-2",
      tourId: "tour-2",
      customerId: "customer-2",
      customerName: "Ana Costa",
      customerEmail: "ana@example.com",
      date: "2025-02-20",
      time: "14:00",
      participants: 4,
      totalPrice: "280",
      status: "pending",
      specialRequests:
        "Celebrando aniversário de casamento. Seria possível incluir uma paragem para champagne?",
      createdAt: new Date().toISOString(),
      tourTitle: "Douro Valley Wine Tour",
      tourLocation: "Douro",
      hostName: "Carlos Ferreira",
    },
  ];

  return (
    <AdminDashboardClient
      locale={locale}
      translations={t}
      user={user}
      stats={stats}
      recentPendingBookings={recentPendingBookings}
    />
  );
}
