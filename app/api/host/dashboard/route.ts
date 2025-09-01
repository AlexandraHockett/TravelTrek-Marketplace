// File: app/api/host/dashboard/route.ts
// Location: CREATE this file in app/api/host/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";

// Mock data for development - replace with actual database queries
const MOCK_HOST_DATA = {
  "current-host": {
    totalBookings: 24,
    monthlyEarnings: 1250.75,
    averageRating: 4.8,
    activeListings: 3,
    pendingBookings: 5,
    confirmedBookings: 12,
    completedBookings: 7,
    cancelledBookings: 0,
    thisMonthEarnings: 1250.75,
    lastMonthEarnings: 980.25,
    earningsGrowth: 27.6,
    recentActivity: [
      {
        id: "1",
        type: "booking",
        message: "Nova reserva para Porto Walking Tour",
        time: "há 2 horas",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        type: "review",
        message: "Nova avaliação de 5 estrelas recebida",
        time: "há 1 dia",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        type: "payout",
        message: "Pagamento de €350 processado",
        time: "há 3 dias",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "4",
        type: "booking",
        message: "Reserva confirmada para Lisbon Food Experience",
        time: "há 5 dias",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "5",
        type: "review",
        message: "Nova avaliação de 4 estrelas recebida",
        time: "há 1 semana",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    upcomingBookings: [
      {
        id: "ub1",
        tourTitle: "Porto Walking Tour",
        customerName: "Maria Silva",
        date: "2025-09-05",
        time: "14:00",
        participants: 2,
        status: "confirmed",
      },
      {
        id: "ub2",
        tourTitle: "Lisbon Food Experience",
        customerName: "João Santos",
        date: "2025-09-07",
        time: "10:00",
        participants: 4,
        status: "pending",
      },
      {
        id: "ub3",
        tourTitle: "Sintra Day Trip",
        customerName: "Ana Costa",
        date: "2025-09-10",
        time: "09:00",
        participants: 3,
        status: "confirmed",
      },
    ],
  },
};

interface DashboardStats {
  totalBookings: number;
  monthlyEarnings: number;
  averageRating: number;
  activeListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings?: number;
  cancelledBookings?: number;
  thisMonthEarnings?: number;
  lastMonthEarnings?: number;
  earningsGrowth?: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "review" | "payout";
    message: string;
    time: string;
    timestamp?: string;
  }>;
  upcomingBookings?: Array<{
    id: string;
    tourTitle: string;
    customerName: string;
    date: string;
    time: string;
    participants: number;
    status: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get("hostId");

    // Validate hostId parameter
    if (!hostId) {
      return NextResponse.json(
        {
          error: "Host ID é obrigatório",
          message: "Parâmetro hostId em falta no pedido",
        },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database query
    // Example: const hostStats = await getHostDashboardStats(hostId);

    // For now, return mock data
    const hostStats = MOCK_HOST_DATA[hostId as keyof typeof MOCK_HOST_DATA];

    if (!hostStats) {
      return NextResponse.json(
        {
          error: "Anfitrião não encontrado",
          message: `Não foram encontrados dados para o anfitrião ${hostId}`,
        },
        { status: 404 }
      );
    }

    // Add cache headers for better performance
    const response = NextResponse.json(hostStats);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching host dashboard data:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: "Ocorreu um erro ao carregar os dados do dashboard",
      },
      { status: 500 }
    );
  }
}

// POST method for updating host dashboard preferences or stats
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get("hostId");

    if (!hostId) {
      return NextResponse.json(
        {
          error: "Host ID é obrigatório",
          message: "Parâmetro hostId em falta no pedido",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // TODO: Implement actual dashboard update logic
    // Example: await updateHostDashboardPreferences(hostId, body);

    return NextResponse.json({
      success: true,
      message: "Preferências do dashboard actualizadas com sucesso",
    });
  } catch (error) {
    console.error("Error updating host dashboard:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: "Ocorreu um erro ao actualizar o dashboard",
      },
      { status: 500 }
    );
  }
}
