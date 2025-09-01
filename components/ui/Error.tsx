// File: components/ui/Error.tsx
// Location: CREATE this file in components/ui/Error.tsx

"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wifi,
  Server,
  XCircle,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface ErrorComponentProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

// Generic Error Display
export function ErrorDisplay({
  error,
  onRetry,
  className = "",
}: ErrorComponentProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}

// Network Error Component
export function NetworkError({
  onRetry,
  className = "",
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`text-center p-8 ${className}`}>
      <Wifi className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        Connection Problem
      </h3>
      <p className="text-gray-600 mb-6">
        Please check your internet connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </button>
      )}
    </div>
  );
}

// Server Error Component
export function ServerError({
  onRetry,
  className = "",
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`text-center p-8 ${className}`}>
      <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Server Error</h3>
      <p className="text-gray-600 mb-6">
        Our servers are experiencing issues. Please try again in a few moments.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}

// Not Found Error
export function NotFoundError({
  resource = "page",
  homeUrl = "/",
  backUrl,
  className = "",
}: {
  resource?: string;
  homeUrl?: string;
  backUrl?: string;
  className?: string;
}) {
  return (
    <div className={`text-center p-8 ${className}`}>
      <div className="max-w-md mx-auto">
        <XCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          {resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The {resource} you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {backUrl && (
            <a
              href={backUrl}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </a>
          )}
          <a
            href={homeUrl}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

// API Error Card (for inline errors)
export function ApiErrorCard({
  error,
  onRetry,
  compact = false,
  className = "",
}: ErrorComponentProps & { compact?: boolean }) {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div
        className={`flex items-${compact ? "center" : "start"} ${compact ? "" : "flex-col sm:flex-row"} gap-3`}
      >
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-red-900">
            {compact ? "Error" : "Unable to load data"}
          </h4>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// Form Error Alert
export function FormError({
  error,
  onDismiss,
  className = "",
}: {
  error: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors ml-2"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Empty State Component
export function EmptyState({
  icon: Icon = AlertTriangle,
  title,
  description,
  action,
  actionLabel,
  className = "",
}: {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm mx-auto mb-6">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Error Boundary Component
export function ErrorFallback({
  error,
  resetError,
  locale = "en",
}: {
  error: Error;
  resetError: () => void;
  locale?: string;
}) {
  const t = useTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. This has been logged and we'll
          look into it.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Error Details:
          </h3>
          <p className="text-xs text-gray-700 font-mono break-words">
            {error.message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          <a
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

// Toast Error (for notifications)
export function ErrorToast({
  error,
  onClose,
  autoClose = true,
  duration = 5000,
}: {
  error: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}) {
  // Auto close functionality
  if (autoClose) {
    setTimeout(onClose, duration);
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-white border border-red-200 rounded-lg shadow-lg">
      <div className="flex items-start p-4">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Error</p>
          <p className="text-sm text-gray-700 mt-1">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
