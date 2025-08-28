// File: components/shared/ErrorBoundary.tsx
// Location: Replace the current ErrorBoundary.tsx with this corrected version
"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md text-center">
            <div className="mb-4">
              <svg
                className="h-16 w-16 text-error mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ops! Algo correu mal
              </h2>

              <p className="text-gray-600 mb-6">
                Ocorreu um erro inesperado. Por favor, tenta novamente.
              </p>
            </div>

            <div className="flex space-x-3 justify-center">
              <Button variant="outline" onClick={this.handleReset}>
                Tentar Novamente
              </Button>
              <Button onClick={this.handleReload}>Recarregar Página</Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Detalhes do Erro (Dev Mode)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto text-error">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <div className="mt-2">{this.state.error.stack}</div>
                  )}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
