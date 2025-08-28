"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface EarningsData {
  period: string;
  amount: number;
  bookings: number;
}

interface EarningsStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  averageBookingValue: number;
  growthRate: number;
}

interface EarningsChartProps {
  period?: "week" | "month" | "year";
}

const EarningsChart: React.FC<EarningsChartProps> = ({ period = "month" }) => {
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/host/earnings?period=${selectedPeriod}`
        );
        if (response.ok) {
          const data = await response.json();
          setEarningsData(data.earnings);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [selectedPeriod]);

  const maxAmount = Math.max(...earningsData.map((d) => d.amount));

  const periodLabels = {
    week: "Semana",
    month: "Mês",
    year: "Ano",
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Ganhos Totais</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(stats.totalEarnings)}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Este Mês</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(stats.monthlyEarnings)}
              </p>
              {stats.growthRate !== 0 && (
                <p
                  className={`text-xs ${stats.growthRate > 0 ? "text-success" : "text-error"}`}
                >
                  {stats.growthRate > 0 ? "+" : ""}
                  {stats.growthRate.toFixed(1)}% vs mês anterior
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Reservas</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Médio</p>
              <p className="text-2xl font-bold text-secondary">
                {formatCurrency(stats.averageBookingValue)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Ganhos por {periodLabels[selectedPeriod]}
          </h3>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="text-sm"
          >
            <option value="week">Últimas 7 semanas</option>
            <option value="month">Últimos 12 meses</option>
            <option value="year">Últimos anos</option>
          </select>
        </div>

        {earningsData.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Ainda sem dados
            </h4>
            <p className="text-gray-600">
              Os teus ganhos aparecerão aqui quando tiveres reservas
              confirmadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Simple Bar Chart */}
            <div className="flex items-end space-x-2 h-48">
              {earningsData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    {/* Bar */}
                    <div
                      className="bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer relative group"
                      style={{
                        height: `${(data.amount / maxAmount) * 160}px`,
                        minHeight: data.amount > 0 ? "4px" : "0px",
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          <div className="font-semibold">
                            {formatCurrency(data.amount)}
                          </div>
                          <div>
                            {data.bookings} reserva
                            {data.bookings !== 1 ? "s" : ""}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {data.period}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded mr-2"></div>
                <span>Ganhos</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Detailed Table */}
      {earningsData.length > 0 && (
        <Card>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo Detalhado
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    Período
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">
                    Reservas
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">
                    Ganhos
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">
                    Média por Reserva
                  </th>
                </tr>
              </thead>
              <tbody>
                {earningsData.map((data, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {data.period}
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-right">
                      {data.bookings}
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(data.amount)}
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-right">
                      {data.bookings > 0
                        ? formatCurrency(data.amount / data.bookings)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EarningsChart;
