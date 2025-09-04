// ===================================================================
// 📁 components/host/EarningsChart.tsx
// Location: SUBSTITUIR components/host/EarningsChart.tsx
// ===================================================================

"use client";

import { useState, useEffect } from "react";
import { Calendar, Euro, TrendingUp, TrendingDown } from "lucide-react";

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

        // ✅ DEVELOPMENT MODE - Use mock data
        if (process.env.NODE_ENV === "development") {
          console.log("🔧 DEV MODE: Using mock earnings data");

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 600));

          const mockEarningsData: EarningsData[] = [
            { month: "Mar 2025", earnings: 1250.5, bookings: 12 },
            { month: "Apr 2025", earnings: 1680.75, bookings: 16 },
            { month: "May 2025", earnings: 2120.25, bookings: 19 },
            { month: "Jun 2025", earnings: 1890.0, bookings: 15 },
            { month: "Jul 2025", earnings: 2450.8, bookings: 22 },
            { month: "Aug 2025", earnings: 2850.5, bookings: 25 },
          ];

          // Filter by period
          let filteredData = mockEarningsData;
          if (period === "6months") {
            filteredData = mockEarningsData.slice(-6);
          } else if (period === "1year") {
            filteredData = mockEarningsData.slice(-12);
          }

          setEarningsData(filteredData);
          return;
        }

        // ✅ PRODUCTION MODE - Try real API
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
        setEarningsData([]);
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

  // Find max value for scaling - FIX: Add fallback for empty arrays
  const maxEarnings =
    earningsData.length > 0
      ? Math.max(...earningsData.map((item) => item.earnings))
      : 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading earnings data...</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-gray-400 mt-2">🔧 Loading mock data</p>
        )}
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

      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === "development" && earningsData.length > 0 && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            🔧 Development Mode: Using mock earnings data ({earningsData.length}{" "}
            months)
          </p>
        </div>
      )}

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
                // Bar Chart - WORKING VERSION
                <div className="flex items-end justify-between h-full gap-2 px-4">
                  {earningsData.map((item, index) => {
                    const height =
                      maxEarnings > 0 ? (item.earnings / maxEarnings) * 280 : 0;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div className="relative group h-full flex flex-col justify-end">
                          <div
                            className="bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all duration-300 cursor-pointer w-full min-w-[30px]"
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
                        <div className="mt-2 text-xs text-gray-600 text-center w-full overflow-hidden text-ellipsis">
                          {item.month.split(" ")[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Line Chart - CSS/DIV VERSION (WORKING)
                <div className="h-full w-full p-4">
                  <div className="text-sm text-gray-500 mb-4">
                    Monthly Earnings Trend
                  </div>

                  <div className="relative h-64">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 pr-2">
                      {[100, 75, 50, 25, 0].map((percent) => (
                        <div key={percent} className="text-xs text-gray-500">
                          €{((percent / 100) * maxEarnings).toFixed(0)}
                        </div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="ml-8 h-full">
                      {/* Grid lines */}
                      <div className="h-full flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="border-t border-gray-100"
                          ></div>
                        ))}
                      </div>

                      {/* Line and points */}
                      <div className="absolute top-0 left-8 right-0 bottom-0">
                        {earningsData.length > 1 && (
                          <svg className="w-full h-full">
                            <path
                              d={earningsData
                                .map((item, i) => {
                                  const x =
                                    (i / (earningsData.length - 1)) * 100;
                                  const y =
                                    100 - (item.earnings / maxEarnings) * 100;
                                  return `${i === 0 ? "M" : "L"} ${x}% ${y}%`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                            />

                            {earningsData.map((item, i) => {
                              const x = (i / (earningsData.length - 1)) * 100;
                              const y =
                                100 - (item.earnings / maxEarnings) * 100;
                              return (
                                <circle
                                  key={i}
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="4"
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="2"
                                  className="cursor-pointer"
                                />
                              );
                            })}
                          </svg>
                        )}

                        {/* Hover tooltips */}
                        {earningsData.map((item, i) => {
                          const x = (i / (earningsData.length - 1)) * 100;
                          const y = 100 - (item.earnings / maxEarnings) * 100;

                          return (
                            <div
                              key={i}
                              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                              }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                €{item.earnings.toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="ml-8 mt-2 flex justify-between">
                      {earningsData.map((item, i) => (
                        <div
                          key={i}
                          className="text-xs text-gray-500 -rotate-45 origin-left"
                        >
                          {item.month.split(" ")[0]}
                        </div>
                      ))}
                    </div>
                  </div>
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
