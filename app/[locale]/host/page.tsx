// File: app/[locale]/host/page.tsx
// Location: REPLACE your existing app/[locale]/host/page.tsx with this corrected version

"use client";

import { useState, useEffect, use } from "react"; // ✅ Added 'use' import
import {
  Calendar,
  Euro,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Plus,
  Activity,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import BookingList from "@/components/host/BookingList";
import EarningsChart from "@/components/host/EarningsChart";

interface HostDashboardProps {
  params: Promise<{ locale: string }>; // ✅ Now Promise<> as per Next.js update
}

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

export default function HostDashboard({ params }: HostDashboardProps) {
  // ✅ Use React.use() to unwrap the params Promise
  const { locale } = use(params);
  const t = useTranslations(locale);

  // State management
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "earnings"
  >("overview");

  // Mock host ID (in real app, get from authentication)
  const hostId = "current-host";

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/host/dashboard?hostId=${hostId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));

      // Mock data fallback for development
      setStats({
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
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
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
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Unable to load dashboard"}
          </h2>
          <p className="text-gray-600 mb-6">
            Ocorreu um erro ao carregar o seu dashboard. Por favor, tente
            novamente.
          </p>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: { value: number; isPositive: boolean };
    color?: "blue" | "green" | "yellow" | "purple";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div
              className={`flex items-center text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("host.dashboard")}
              </h1>
              <p className="text-lg text-gray-600">{t("host.welcome")}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-5 w-5" />
              Criar Novo Tour
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t("host.stats.totalBookings")}
            value={stats.totalBookings}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title={t("host.stats.monthlyEarnings")}
            value={formatCurrency(stats.monthlyEarnings, locale)}
            icon={Euro}
            trend={{
              value: stats.earningsGrowth || 0,
              isPositive: (stats.earningsGrowth || 0) > 0,
            }}
            color="green"
          />
          <StatCard
            title={t("host.stats.averageRating")}
            value={`${stats.averageRating.toFixed(1)} ⭐`}
            icon={Star}
            color="yellow"
          />
          <StatCard
            title={t("host.stats.activeListings")}
            value={stats.activeListings}
            icon={MapPin}
            color="purple"
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["overview", "bookings", "earnings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {t(`host.tabs.${tab}`)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("host.recentActivity.title")}
                  </h2>
                </div>
                <div className="space-y-4">
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "booking" && (
                            <Calendar className="h-4 w-4 text-blue-500" />
                          )}
                          {activity.type === "review" && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                          {activity.type === "payout" && (
                            <Euro className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      {t("host.recentActivity.noActivity")}
                    </p>
                  )}
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("host.upcomingBookings.title")}
                  </h2>
                </div>
                <div className="space-y-4">
                  {stats.upcomingBookings &&
                  stats.upcomingBookings.length > 0 ? (
                    stats.upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            {booking.tourTitle}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status === "confirmed"
                              ? "Confirmado"
                              : "Pendente"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {booking.customerName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.participants}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      {t("host.upcomingBookings.noUpcoming")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <BookingList hostId={hostId} locale={locale} />
          )}

          {activeTab === "earnings" && (
            <EarningsChart hostId={hostId} locale={locale} />
          )}
        </div>
      </div>
    </div>
  );
}
