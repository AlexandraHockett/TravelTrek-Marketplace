// ===================================================================
// 📁 app/[locale]/host/page.tsx
// Location: SUBSTITUIR com traduções implementadas
// ===================================================================

"use client";

import { useState, useEffect, use } from "react";
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
import BookingList from "@/components/host/BookingList";
import EarningsChart from "@/components/host/EarningsChart";
import Link from "next/link";

interface HostDashboardProps {
  params: Promise<{ locale: string }>;
}

interface DashboardStats {
  totalBookings: number;
  monthlyEarnings: number;
  averageRating: number;
  activeListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  earningsGrowth: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "review" | "payout";
    message: string;
    time: string;
    timestamp: string;
  }>;
  upcomingBookings: Array<{
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
  const { locale } = use(params);
  const t = useTranslations(locale);

  // State management
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "earnings"
  >("overview");

  const hostId = "current-host";

  // ✅ FIXED: Usar apenas o endpoint /api/host/dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching dashboard data...");

      const response = await fetch(`/api/host/dashboard?hostId=${hostId}`);

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ API Error:", errorData);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Dashboard data received:", data);

      setStats(data);
    } catch (error) {
      console.error("💥 Error fetching dashboard stats:", error);
      setError(
        error instanceof Error
          ? error.message
          : t("common.errors.loadFailed") || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ✅ Development mode indicator
  const isDevelopment = process.env.NODE_ENV === "development";

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t("common.loading") || "Loading Host Dashboard..."}
          </p>
          {isDevelopment && (
            <p className="text-xs text-gray-400 mt-2">
              🔧 {t("common.devMode") || "Development Mode"}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("host.dashboard.error.title") || "Error Loading Dashboard"}
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("common.retry") || "Try Again"}
          </button>
          {isDevelopment && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
              <p className="font-medium">Debug Info:</p>
              <p>• Check if server is running on :3000</p>
              <p>• Verify /api/host/dashboard exists</p>
              <p>• Check console for detailed errors</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Development Mode Banner */}
        {isDevelopment && (
          <div className="mb-6 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">
                🔧{" "}
                {t("common.devModeMessage") ||
                  "Development Mode: Authentication bypassed for testing"}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("host.dashboard.title") || "Host Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("host.dashboard.subtitle") || "Manage tours and bookings"}
              </p>
            </div>
            <Link href={`/${locale}/host/tours/create`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                {t("host.dashboard.createTour") || "Create Tour"}
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("host.dashboard.stats.totalBookings") || "Total Bookings"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalBookings || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("host.dashboard.stats.monthlyEarnings") ||
                    "Monthly Earnings"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  €{(stats?.monthlyEarnings || 0).toFixed(2)}
                </p>
                {stats?.earningsGrowth !== undefined && (
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      stats.earningsGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stats.earningsGrowth >= 0 ? "+" : ""}
                    {stats.earningsGrowth.toFixed(1)}%
                  </p>
                )}
              </div>
              <Euro className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("host.dashboard.stats.averageRating") || "Average Rating"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageRating || 0}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("host.dashboard.stats.activeListings") ||
                    "Active Listings"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeListings || 0}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {(["overview", "bookings", "earnings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t(`host.dashboard.tabs.${tab}`) ||
                  tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("host.dashboard.recentActivity.title") ||
                    "Recent Activity"}
                </h3>
                <div className="space-y-4">
                  {stats?.recentActivity?.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  {(!stats?.recentActivity ||
                    stats.recentActivity.length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      {t("host.dashboard.recentActivity.empty") ||
                        "No recent activity"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Bookings & Quick Stats */}
            <div>
              {/* Upcoming Bookings */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("host.dashboard.upcomingBookings.title") ||
                    "Upcoming Bookings"}
                </h3>
                <div className="space-y-3">
                  {stats?.upcomingBookings?.map((booking) => (
                    <div
                      key={booking.id}
                      className="border-l-4 border-blue-500 pl-3"
                    >
                      <p className="font-medium text-sm text-gray-900">
                        {booking.tourTitle}
                      </p>
                      <p className="text-xs text-gray-600">
                        {booking.customerName} • {booking.date} • {booking.time}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {booking.participants}{" "}
                          {t("common.participants") || "participants"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!stats?.upcomingBookings ||
                    stats.upcomingBookings.length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      {t("host.dashboard.upcomingBookings.empty") ||
                        "No upcoming bookings"}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("host.dashboard.quickStats.title") || "Quick Stats"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {t("host.dashboard.stats.confirmed") || "Confirmed"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {stats?.confirmedBookings || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {t("host.dashboard.stats.pending") || "Pending"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {stats?.pendingBookings || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        {t("host.dashboard.stats.completed") || "Completed"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {stats?.completedBookings || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <BookingList hostId={hostId} />
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <EarningsChart hostId={hostId} locale={locale} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("host.dashboard.earnings.summary") || "Earnings Summary"}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {t("host.dashboard.earnings.thisMonth") || "This Month"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{(stats?.thisMonthEarnings || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("host.dashboard.earnings.lastMonth") || "Last Month"}
                  </p>
                  <p className="text-xl font-semibold text-gray-700">
                    €{(stats?.lastMonthEarnings || 0).toFixed(2)}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {t("host.dashboard.earnings.growth") || "Growth"}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      (stats?.earningsGrowth || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(stats?.earningsGrowth || 0) >= 0 ? "+" : ""}
                    {(stats?.earningsGrowth || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
