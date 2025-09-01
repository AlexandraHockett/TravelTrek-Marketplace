// File: components/host/EarningsChart.tsx
// Location: REPLACE/CREATE in components/host/EarningsChart.tsx

"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Euro,
  Calendar,
  Download,
  Eye,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

interface EarningsData {
  period: string;
  amount: number;
  bookings: number;
  month?: string;
  year?: number;
}

interface EarningsSummary {
  thisMonth: number;
  lastMonth: number;
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  currency: string;
  growth: number;
  monthlyData: EarningsData[];
}

interface EarningsChartProps {
  hostId?: string;
  locale: string;
  className?: string;
}

export default function EarningsChart({
  hostId,
  locale,
  className = "",
}: EarningsChartProps) {
  const t = useTranslations(locale);

  // State management
  const [earningsData, setEarningsData] = useState<EarningsSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "6months" | "1year" | "all"
  >("6months");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  // Fetch earnings data from API
  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (hostId) params.append("hostId", hostId);
      params.append("period", selectedPeriod);

      const response = await fetch(`/api/earnings?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEarningsData(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));
      setEarningsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and period change
  useEffect(() => {
    fetchEarningsData();
  }, [selectedPeriod, hostId]);

  // Export earnings data
  const exportEarnings = () => {
    if (!earningsData) return;

    const csvContent = [
      ["Period", "Amount", "Bookings"].join(","),
      ...earningsData.monthlyData.map((item) =>
        [item.period, item.amount, item.bookings].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple bar chart component (no external dependency)
  const SimpleBarChart = ({ data }: { data: EarningsData[] }) => {
    const maxAmount = Math.max(...data.map((d) => d.amount));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-gray-600 flex-shrink-0">
              {item.period}
            </div>
            <div className="flex-1 relative">
              <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500 ease-out rounded-full relative"
                  style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                >
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(
                        item.amount,
                        earningsData?.currency || "EUR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-12 text-sm text-gray-500 text-right">
              {item.bookings}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !earningsData) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center py-8">
          <Euro className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || t("errors.generic")}
          </h3>
          <button
            onClick={fetchEarningsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t("host.earnings.title")}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setViewMode(viewMode === "chart" ? "table" : "chart")
              }
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              {viewMode === "chart" ? "Table" : "Chart"}
            </button>
            <button
              onClick={exportEarnings}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(e.target.value as typeof selectedPeriod)
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* This Month */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("host.earnings.thisMonth")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    earningsData.thisMonth,
                    earningsData.currency
                  )}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  earningsData.growth >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {earningsData.growth >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`font-medium ${
                  earningsData.growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {earningsData.growth >= 0 ? "+" : ""}
                {earningsData.growth.toFixed(1)}%
              </span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("host.earnings.totalEarnings")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    earningsData.totalEarnings,
                    earningsData.currency
                  )}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Euro className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("host.earnings.pendingPayouts")}
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(
                    earningsData.pendingPayouts,
                    earningsData.currency
                  )}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Completed Payouts */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t("host.earnings.completedPayouts")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    earningsData.completedPayouts,
                    earningsData.currency
                  )}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart/Table Content */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {t("host.earnings.chartTitle")}
        </h3>

        {viewMode === "chart" ? (
          <div className="space-y-4">
            {earningsData.monthlyData.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Period</span>
                  <span>Bookings</span>
                </div>
                <SimpleBarChart data={earningsData.monthlyData} />
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No earnings data available for the selected period.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average/Booking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earningsData.monthlyData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {item.period}
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(item.amount, earningsData.currency)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {item.bookings}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {item.bookings > 0
                        ? formatCurrency(
                            item.amount / item.bookings,
                            earningsData.currency
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
