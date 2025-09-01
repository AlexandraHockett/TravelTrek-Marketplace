// File: components/ui/Loading.tsx
// Location: CREATE this file in components/ui/Loading.tsx

"use client";

import { Loader2, Calendar, MapPin, Users } from "lucide-react";

// Basic loading spinner
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Loading button (for forms and actions)
export function LoadingButton({
  loading,
  children,
  disabled,
  className = "",
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

// Tour Card Skeleton
export function TourCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Booking Card Skeleton
export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-300" />
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-300" />
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-right">
            <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-20 ml-auto mt-1"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-10"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full animate-pulse">
        <thead>
          <tr className="border-b border-gray-200">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
            <div className="flex-1 bg-gray-200 h-6 rounded relative">
              <div
                className="bg-gray-300 h-full rounded"
                style={{ width: `${Math.random() * 80 + 20}%` }}
              ></div>
            </div>
            <div className="w-8 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Page Loading (Full screen)
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}

// Form Loading Overlay
export function FormLoadingOverlay({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Content Loading (for sections)
export function ContentLoading({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded ${
            i === lines - 1 ? "w-2/3" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  );
}

// List Loading
export function ListLoading({
  items = 5,
  className = "",
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
