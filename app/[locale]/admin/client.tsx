// ===================================================================
// 📁 app/[locale]/admin/client.tsx
// Location: CREATE NEW FILE app/[locale]/admin/client.tsx
// Client component do painel de administração (sem framer-motion)
// ===================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Eye,
  MessageSquare,
  Globe,
  Sparkles,
  BookOpen,
  UserCheck,
  Shield,
  BarChart3,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface AdminDashboardClientProps {
  locale: string;
  translations: any;
  user: any;
  stats: {
    totalBookings: number;
    pendingBookings: number;
    totalUsers: number;
    totalHosts: number;
    totalTours: number;
    monthlyRevenue: number;
  };
  recentPendingBookings: any[];
}

export default function AdminDashboardClient({
  locale,
  translations: t,
  user,
  stats,
  recentPendingBookings,
}: AdminDashboardClientProps) {
  const [processingBooking, setProcessingBooking] = useState<string | null>(
    null
  );

  const handleBookingAction = async (
    bookingId: string,
    action: "accept" | "reject"
  ) => {
    setProcessingBooking(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "accept" ? "confirmed" : "cancelled",
        }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      // Simple success message
      alert(
        action === "accept"
          ? t("admin.bookingAccepted") || "Booking accepted successfully"
          : t("admin.bookingRejected") || "Booking rejected"
      );

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      alert(t("errors.generic") || "Error processing booking");
    } finally {
      setProcessingBooking(null);
    }
  };

  const statCards = [
    {
      title: t("admin.stats.pendingApprovals") || "Pending Approvals",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-100",
      trend: "+5%",
      href: `/${locale}/admin/bookings?status=pending`,
    },
    {
      title: t("admin.stats.monthlyRevenue") || "Monthly Revenue",
      value: formatPrice(stats.monthlyRevenue),
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
      trend: "+12%",
      href: `/${locale}/admin/analytics`,
    },
    {
      title: t("admin.stats.totalBookings") || "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-blue-600 bg-blue-100",
      trend: "+8%",
      href: `/${locale}/admin/bookings`,
    },
    {
      title: t("admin.stats.activeHosts") || "Active Hosts",
      value: stats.totalHosts,
      icon: Users,
      color: "text-purple-600 bg-purple-100",
      trend: "+3%",
      href: `/${locale}/admin/users?role=host`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h1 className="text-4xl font-bold">
                  {t("admin.title") || "Admin Control Center"}
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                {(
                  t("admin.welcome") ||
                  `Welcome back, {name}! Manage your marketplace with confidence.`
                ).replace("{name}", user.name)}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/${locale}/admin/bookings`}>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t("admin.allBookings") || "All Bookings"}
                </Button>
              </Link>
              <Link href={`/${locale}/admin/users`}>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t("admin.manageUsers") || "Manage Users"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-8">
          {statCards.map((stat, index) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/95 backdrop-blur border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.title}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                  {t("admin.viewDetails") || "View details"}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pending Bookings Section */}
        {recentPendingBookings.length > 0 && (
          <Card className="p-6 bg-white/95 backdrop-blur border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("admin.pendingBookings") || "Bookings Awaiting Approval"}
                  </h2>
                  <p className="text-gray-600">
                    {t("admin.pendingDesc") ||
                      "Review and approve host booking requests"}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="px-3 py-1">
                <Sparkles className="w-4 h-4 mr-1" />
                {recentPendingBookings.length} {t("admin.pending") || "pending"}
              </Badge>
            </div>

            <div className="space-y-4">
              {recentPendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {booking.tourTitle}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {booking.customerName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(booking.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-4 h-4" />
                              {booking.participants}{" "}
                              {t("common.persons") || "persons"}
                            </span>
                          </div>
                          {booking.specialRequests && (
                            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg mb-3">
                              <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-900 mb-1">
                                  {t("admin.hostMessage") || "Host Message:"}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {booking.specialRequests}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(booking.totalPrice)}
                            </span>
                            <Badge variant="default" className="ml-2">
                              {booking.tourLocation}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleBookingAction(booking.id, "accept")
                        }
                        disabled={processingBooking === booking.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t("admin.accept") || "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleBookingAction(booking.id, "reject")
                        }
                        disabled={processingBooking === booking.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {t("admin.reject") || "Reject"}
                      </Button>
                      <Link href={`/${locale}/admin/bookings/${booking.id}`}>
                        <Button size="sm" variant="ghost" className="w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          {t("admin.details") || "Details"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recentPendingBookings.length === 10 && (
              <div className="mt-6 text-center">
                <Link href={`/${locale}/admin/bookings?status=pending`}>
                  <Button variant="outline" className="mx-auto">
                    {t("admin.viewAllPending") || "View All Pending Bookings"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
            <Link href={`/${locale}/admin/analytics`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {t("admin.analytics") || "Analytics Dashboard"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("admin.analyticsDesc") ||
                      "View detailed reports and insights"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
            <Link href={`/${locale}/admin/messages`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {t("admin.messages") || "Message Center"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("admin.messagesDesc") ||
                      "Manage host-customer communications"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
            <Link href={`/${locale}/admin/translations`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {t("admin.translations.title") || "Translations"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("admin.translationsDesc") ||
                      "Manage message translations"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
