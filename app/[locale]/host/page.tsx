// File: app/[locale]/host/page.tsx
// Location: CREATE/REPLACE in app/[locale]/host/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Euro,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Plus,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import BookingList from "@/components/host/BookingList";
import EarningsChart from "@/components/host/EarningsChart";

interface HostDashboardProps {
  params: { locale: string };
}

interface DashboardStats {
  totalBookings: number;
  monthlyEarnings: number;
  averageRating: number;
  activeListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "review" | "payout";
    message: string;
    time: string;
  }>;
}

export default function HostDashboard({ params }: HostDashboardProps) {
  const { locale } = params;
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
        monthlyEarnings: 1250,
        averageRating: 4.8,
        activeListings: 3,
        pendingBookings: 5,
        confirmedBookings: 12,
        recentActivity: [
          {
            id: "1",
            type: "booking",
            message: "New booking for Porto Walking Tour",
            time: "2 hours ago",
          },
          {
            id: "2",
            type: "review",
            message: "New 5-star review received",
            time: "1 day ago",
          },
          {
            id: "3",
            type: "payout",
            message: "Payout of €350 processed",
            time: "3 days ago",
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Unable to load dashboard"}
          </h2>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <p className="text-lg text-gray-600">
                Welcome back! Here's what's happening with your tours.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={`/${locale}/host/tours/create`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tour
              </a>
              <a
                href={`/${locale}/host/tours`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Manage Tours
              </a>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("host.totalBookings")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("host.monthlyEarnings")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyEarnings, "EUR")}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">+8.3%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("host.avgRating")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.averageRating}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(stats.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">Excellent</span>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("host.activeListings")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeListings}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">All active and visible</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">
                {stats.pendingBookings}
              </p>
              <p className="text-sm text-gray-600">Pending Bookings</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">
                {stats.confirmedBookings}
              </p>
              <p className="text-sm text-gray-600">Confirmed Today</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">3</p>
              <p className="text-sm text-gray-600">Tours Today</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">92%</p>
              <p className="text-sm text-gray-600">Booking Rate</p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: "overview", label: "Recent Activity", icon: Clock },
                { key: "bookings", label: "Latest Bookings", icon: Calendar },
                { key: "earnings", label: "Earnings Report", icon: Euro },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          activity.type === "booking"
                            ? "bg-blue-100"
                            : activity.type === "review"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                      >
                        {activity.type === "booking" && (
                          <Calendar className="w-4 h-4 text-blue-600" />
                        )}
                        {activity.type === "review" && (
                          <Star className="w-4 h-4 text-yellow-600" />
                        )}
                        {activity.type === "payout" && (
                          <Euro className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <a
                    href={`/${locale}/host/activity`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all activity
                  </a>
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
    </div>
  );
}
