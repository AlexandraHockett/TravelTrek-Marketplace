// ===================================================================
// 📁 app/[locale]/auth/callback/google/page.tsx
// Location: CRIAR este ficheiro
// ===================================================================

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface GoogleCallbackPageProps {
  params: Promise<{ locale: string }>;
}

export default function GoogleCallbackPage({
  params,
}: GoogleCallbackPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Wait for params to be available
      const { locale } = await params;

      if (status === "loading") return; // Still loading

      if (status === "unauthenticated") {
        // Auth failed, redirect to login
        router.push(`/${locale}/auth/login?error=google_auth_failed`);
        return;
      }

      if (status === "authenticated" && session?.user) {
        // ✅ Check if there's a pending role update needed
        const pendingRole =
          typeof window !== "undefined"
            ? sessionStorage.getItem("pendingRole")
            : null;

        if (pendingRole && pendingRole !== session.user.role) {
          // ✅ Update user role via API
          try {
            const response = await fetch(`/api/users/${session.user.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                role: pendingRole,
              }),
            });

            if (response.ok) {
              console.log(`Updated user role to: ${pendingRole}`);
              // Clear sessionStorage
              sessionStorage.removeItem("pendingRole");
              // Force session refresh
              window.location.reload();
              return;
            }
          } catch (error) {
            console.error("Error updating user role:", error);
          }
        }

        // ✅ Clear any pending role
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pendingRole");
        }

        // ✅ Redirect based on user role
        switch (session.user.role) {
          case "host":
            router.push(`/${locale}/host`);
            break;
          case "customer":
            router.push(`/${locale}/customer`);
            break;
          case "admin":
            router.push(`/${locale}/admin`);
            break;
          default:
            router.push(`/${locale}`);
        }
      }
    };

    handleGoogleCallback();
  }, [session, status, router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">
          A finalizar autenticação com Google...
        </p>
      </div>
    </div>
  );
}
