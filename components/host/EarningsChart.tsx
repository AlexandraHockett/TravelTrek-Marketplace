// ===================================================================
// 📁 components/host/EarningsChart.tsx
// Location: SUBSTITUIR components/host/EarningsChart.tsx
// ===================================================================

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Euro,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

interface EarningsData {
  month: string;
  earnings: number;
  bookings: number;
}

interface EarningsChartProps {
  hostId: string;
  locale?: string;
}

export default function EarningsChart({
  hostId,
  locale = "en",
}: EarningsChartProps) {
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  const [period, setPeriod] = useState<"6months" | "1year" | "all">("6months");

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);

        // Fetch bookings and calculate earnings by month
        const response = await fetch(`/api/bookings?hostId=${hostId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch earnings data");
        }

        const bookings = await response.json();

        // Process bookings to calculate monthly earnings
        const monthlyData = new Map<
          string,
          { earnings: number; bookings: number }
        >();

        bookings.forEach((booking: any) => {
          if (
            booking.status === "completed" ||
            booking.status === "confirmed"
          ) {
            const date = new Date(booking.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (!monthlyData.has(monthKey)) {
              monthlyData.set(monthKey, { earnings: 0, bookings: 0 });
            }

            const existing = monthlyData.get(monthKey)!;
            existing.earnings += booking.totalPrice || 0;
            existing.bookings += 1;
          }
        });

        // Convert to array and sort by date
        const sortedData = Array.from(monthlyData.entries())
          .map(([key, data]) => ({
            month: new Date(key + "-01").toLocaleDateString(locale, {
              month: "short",
              year: "numeric",
            }),
            earnings: data.earnings,
            bookings: data.bookings,
          }))
          .sort(
            (a, b) =>
              new Date(a.month + " 1").getTime() -
              new Date(b.month + " 1").getTime()
          );

        // Filter by period
        let filteredData = sortedData;
        if (period === "6months") {
          filteredData = sortedData.slice(-6);
        } else if (period === "1year") {
          filteredData = sortedData.slice(-12);
        }

        setEarningsData(filteredData);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [hostId, period, locale]);

  const totalEarnings = earningsData.reduce(
    (sum, item) => sum + item.earnings,
    0
  );
  const totalBookings = earningsData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );

  // Calculate growth
  const currentMonth = earningsData[earningsData.length - 1];
  const previousMonth = earningsData[earningsData.length - 2];
  const growth =
    previousMonth && currentMonth
      ? ((currentMonth.earnings - previousMonth.earnings) /
          previousMonth.earnings) *
        100
      : 0;

  // Find max value for scaling
  const maxEarnings = Math.max(...earningsData.map((item) => item.earnings));

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading earnings data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Earnings Overview</h2>

        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 text-sm rounded-l-lg ${
                chartType === "bar"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 text-sm rounded-r-lg ${
                chartType === "line"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Total Earnings
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            €{totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Total Bookings
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {growth >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium text-purple-600">
              Monthly Growth
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${growth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg border">
        {earningsData.length === 0 ? (
          <div className="text-center py-12">
            <Euro className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No earnings data available yet.</p>
            <p className="text-gray-500 text-sm">
              Start accepting bookings to see your earnings grow!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Container */}
            <div className="relative" style={{ height: "350px" }}>
              {chartType === "bar" ? (
                // Bar Chart
                <div className="flex items-end justify-center h-full gap-2 px-4">
                  {earningsData.map((item, index) => {
                    const height =
                      maxEarnings > 0 ? (item.earnings / maxEarnings) * 280 : 0;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1 max-w-16"
                      >
                        <div className="relative group">
                          <div
                            className="bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all duration-300 cursor-pointer w-full min-h-1"
                            style={{ height: `${Math.max(height, 4)}px` }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            <div className="text-center">
                              <div>€{item.earnings.toFixed(2)}</div>
                              <div className="text-xs text-gray-300">
                                {item.bookings} bookings
                              </div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 text-center transform -rotate-45 origin-center">
                          {item.month.split(" ")[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Line Chart
                <div className="relative h-full">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {/* Grid lines */}
                    <defs>
                      <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Line path */}
                    {earningsData.length > 1 && (
                      <path
                        d={earningsData
                          .map((item, index) => {
                            const x = (index / (earningsData.length - 1)) * 100;
                            const y =
                              maxEarnings > 0
                                ? 100 - (item.earnings / maxEarnings) * 90
                                : 50;
                            return `${index === 0 ? "M" : "L"} ${x}% ${y}%`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        className="drop-shadow-sm"
                      />
                    )}

                    {/* Data points */}
                    {earningsData.map((item, index) => {
                      const x =
                        (index / Math.max(earningsData.length - 1, 1)) * 100;
                      const y =
                        maxEarnings > 0
                          ? 100 - (item.earnings / maxEarnings) * 90
                          : 50;
                      return (
                        <g key={index}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                            className="cursor-pointer hover:r-8 transition-all duration-200"
                          />
                          {/* Month labels */}
                          <text
                            x={`${x}%`}
                            y="95%"
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                          >
                            {item.month.split(" ")[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">
                      Month
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Earnings
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Bookings
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Avg per Booking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 font-medium text-gray-900">
                        {item.month}
                      </td>
                      <td className="py-2 text-right font-semibold text-green-600">
                        €{item.earnings.toFixed(2)}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {item.bookings}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        €
                        {item.bookings > 0
                          ? (item.earnings / item.bookings).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
