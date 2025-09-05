// ===================================================================
// 📁 components/auth/SignupForm.tsx - CORRECTED WITH ROLE SELECTION
// Location: REPLACE ENTIRE CONTENT of components/auth/SignupForm.tsx
// ===================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";

interface SignupFormProps {
  locale: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "customer" | "host"; // 🆕 Added role selection
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  general?: string;
}

// Simple Button Component (keeping existing inline approach)
const SimpleButton: React.FC<{
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
  children,
}) => {
  const baseStyles =
    "w-full flex justify-center py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variantStyles = {
    primary:
      "border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
    outline:
      "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Simple Card Component (keeping existing inline approach)
const SimpleCard: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

// Simple Loading Spinner (keeping existing)
const SimpleSpinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

// 🆕 Role Selection Card Component
const RoleCard: React.FC<{
  role: "customer" | "host";
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ role, selected, onClick, title, description, icon }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`flex-shrink-0 ${selected ? "text-blue-600" : "text-gray-400"}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3
            className={`text-sm font-medium ${selected ? "text-blue-900" : "text-gray-900"}`}
          >
            {title}
          </h3>
          <p
            className={`text-xs ${selected ? "text-blue-700" : "text-gray-600"}`}
          >
            {description}
          </p>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
          }`}
        >
          {selected && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations(locale);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Default to customer
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes (keeping existing logic)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 🆕 Handle role selection
  const handleRoleChange = (role: "customer" | "host") => {
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  // Form validation (keeping existing + adding role validation)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("auth.error.required");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("auth.error.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.error.invalidEmail");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("auth.error.required");
    } else if (formData.password.length < 8) {
      newErrors.password = t("auth.error.weakPassword");
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.error.required");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.error.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (updated to include role)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Create user account via API
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, // 🆕 Include selected role
          emailVerified: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (result.code === "EMAIL_ALREADY_EXISTS") {
          setErrors({ email: t("auth.error.emailExists") });
        } else {
          setErrors({ general: t("auth.error.serverError") });
        }
        return;
      }

      // Account created successfully, now sign in
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setErrors({ general: t("auth.error.serverError") });
      } else {
        // Success - redirect based on role
        const redirectPath = formData.role === "host" ? "/host" : "/customer";
        router.push(`/${locale}${redirectPath}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: t("auth.error.serverError") });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup (updated to respect selected role)
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Store selected role in sessionStorage before Google auth
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingRole", formData.role);
      }

      await signIn("google", {
        callbackUrl: `/${locale}/${formData.role === "host" ? "host" : "customer"}`,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ general: t("auth.error.oauthError") || "Erro do servidor" });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("auth.signupTitle") || "Criar Conta"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.signupSubtitle") || "Junta-te à nossa comunidade"}
        </p>
      </div>

      <SimpleCard className="p-8">
        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* 🆕 Account Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("auth.chooseAccountType") || "Escolha o tipo de conta"}
          </h3>
          <div className="space-y-3">
            <RoleCard
              role="customer"
              selected={formData.role === "customer"}
              onClick={() => handleRoleChange("customer")}
              title={t("roles.customer") || "Cliente"}
              description={
                t("auth.customerDescription") || "Navegar e reservar tours"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <RoleCard
              role="host"
              selected={formData.role === "host"}
              onClick={() => handleRoleChange("host")}
              title={t("roles.host") || "Anfitrião"}
              description={t("auth.hostDescription") || "Criar e gerir tours"}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                  />
                </svg>
              }
            />
          </div>
          {errors.role && (
            <p className="mt-2 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="sr-only">
              {t("auth.namePlaceholder") || "O teu nome completo"}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder={t("auth.namePlaceholder") || "O teu nome completo"}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">
              {t("auth.emailPlaceholder") || "Introduza o seu email"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                errors.email ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder={
                t("auth.emailPlaceholder") || "Introduza o seu email"
              }
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">
              {t("auth.passwordPlaceholder") || "Introduza a sua palavra-passe"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                errors.password ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder={
                t("auth.passwordPlaceholder") || "Introduza a sua palavra-passe"
              }
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              {t("auth.confirmPasswordPlaceholder") ||
                "Confirma a tua palavra-passe"}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder={
                t("auth.confirmPasswordPlaceholder") ||
                "Confirma a tua palavra-passe"
              }
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <SimpleButton type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <SimpleSpinner />
                <span className="ml-2">
                  {t("auth.signupLoading") || "A criar conta..."}
                </span>
              </div>
            ) : (
              `${t("auth.signupButton") || "Criar Conta"} ${formData.role === "host" ? `(${t("roles.host") || "Anfitrião"})` : `(${t("roles.customer") || "Cliente"})`}`
            )}
          </SimpleButton>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t("auth.orContinueWith") || "Ou continua com"}
              </span>
            </div>
          </div>

          {/* Google Signup Button */}
          <div className="mt-4">
            <SimpleButton
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("auth.googleLogin") || "Continuar com Google"} (
                {formData.role === "host"
                  ? t("roles.host") || "Anfitrião"
                  : t("roles.customer") || "Cliente"}
                )
              </div>
            </SimpleButton>
          </div>
        </div>

        {/* 🆕 Host Information */}
        {formData.role === "host" && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-2">
                {t("auth.hostInfo") || "Informação para Anfitriões:"}
              </p>
              <ul className="space-y-1 text-amber-700 text-xs">
                <li>
                  •{" "}
                  {t("auth.hostBenefit1") ||
                    "Poderá criar e gerir os seus próprios tours"}
                </li>
                <li>
                  •{" "}
                  {t("auth.hostBenefit2") ||
                    "Receber reservas e comunicar com clientes"}
                </li>
                <li>
                  •{" "}
                  {t("auth.hostBenefit3") ||
                    "Acompanhar os seus ganhos e estatísticas"}
                </li>
                <li>
                  •{" "}
                  {t("auth.hostBenefit4") ||
                    "Acesso a ferramentas de gestão avançadas"}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("auth.hasAccount") || "Já tens conta?"}{" "}
            <a
              href={`/${locale}/auth/login`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("auth.loginLink") || "Iniciar sessão"}
            </a>
          </p>
        </div>
      </SimpleCard>
    </div>
  );
}
