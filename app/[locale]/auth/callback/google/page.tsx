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
      const { locale } = await params;
      const isSignup = searchParams.get("signup") === "true";

      console.log(
        `🔍 Google callback - isSignup: ${isSignup}, status: ${status}`
      );

      if (status === "loading") return;

      if (status === "unauthenticated") {
        // ✅ Check if this was a signup attempt that failed
        const wasSignup =
          typeof window !== "undefined"
            ? sessionStorage.getItem("isSignup") === "true"
            : false;

        if (wasSignup || isSignup) {
          console.log(
            "📝 Signup failed - user doesn't exist, creating account..."
          );

          // Clear signup markers
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("isSignup");
          }

          // Redirect to signup with Google data if available
          router.push(`/${locale}/auth/signup?google_signup=true`);
          return;
        }

        // Regular login failure
        router.push(`/${locale}/auth/login?error=google_auth_failed`);
        return;
      }

      if (status === "authenticated" && session?.user) {
        console.log("✅ Google auth successful");

        // ✅ Check if this was a signup (user was just created)
        const pendingRole =
          typeof window !== "undefined"
            ? sessionStorage.getItem("pendingRole")
            : null;

        const wasSignup =
          typeof window !== "undefined"
            ? sessionStorage.getItem("isSignup") === "true"
            : false;

        // ✅ If signup, create/update user with correct role
        if ((wasSignup || isSignup) && pendingRole) {
          console.log(`🆕 Processing signup with role: ${pendingRole}`);

          try {
            // Create user in our database
            const response = await fetch("/api/auth/google-signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                role: pendingRole,
              }),
            });

            const result = await response.json();

            if (result.success) {
              console.log(`✅ User created/updated with role: ${pendingRole}`);

              // Clear session storage
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("pendingRole");
                sessionStorage.removeItem("isSignup");
              }

              // Redirect to correct dashboard
              const redirectPath =
                pendingRole === "host" ? "/host" : "/customer";
              window.location.href = `/${locale}${redirectPath}`;
              return;
            }
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }

        // ✅ Clear any remaining signup markers
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pendingRole");
          sessionStorage.removeItem("isSignup");
        }

        // ✅ Regular redirect based on user role
        const redirectPath =
          session.user.role === "host"
            ? "/host"
            : session.user.role === "admin"
              ? "/admin"
              : "/customer";

        router.push(`/${locale}${redirectPath}`);
      }
    };

    handleGoogleCallback();
  }, [session, status, router, params, searchParams]);

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
