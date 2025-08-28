// components/host/EarningsChart.tsx
"use client";
import { useEffect, useState } from "react";

export default function EarningsChart() {
  const [earnings, setEarnings] = useState<{ month: string; amount: number }[]>(
    []
  );

  useEffect(() => {
    // Fetch earnings data from API
    fetch("/api/earnings")
      .then((res) => res.json())
      .then((data) => setEarnings(data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Earnings Over Time</h3>
      {/* Chart implementation below */}
    </div>
  );
}
