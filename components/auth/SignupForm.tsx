// ===================================================================
// 📁 components/auth/SignupForm.tsx - FINAL VERSION
// Location: REPLACE components/auth/SignupForm.tsx completely
// ===================================================================

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  locale: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Simple translation function (internal)
const getTranslation = (key: string, locale: string): string => {
  const translations: Record<string, Record<string, string>> = {
    pt: {
      "auth.signupTitle": "Criar Conta",
      "auth.signupSubtitle": "Junta-te à nossa comunidade de viajantes",
      "auth.namePlaceholder": "O teu nome completo",
      "auth.emailPlaceholder": "Introduz o teu email",
      "auth.passwordPlaceholder": "Introduz a tua palavra-passe",
      "auth.confirmPasswordPlaceholder": "Confirma a tua palavra-passe",
      "auth.signupButton": "Criar Conta",
      "auth.signupLoading": "A criar conta...",
      "auth.orContinueWith": "Ou continua com",
      "auth.googleLogin": "Continuar com Google",
      "auth.hasAccount": "Já tens conta?",
      "auth.loginLink": "Iniciar sessão",
      "auth.error.required": "Este campo é obrigatório.",
      "auth.error.invalidEmail": "Email inválido.",
      "auth.error.weakPassword": "A palavra-passe deve ter pelo menos 8 caracteres.",
      "auth.error.passwordMismatch": "As palavras-passe não coincidem.",
      "auth.error.emailExists": "Este email já está registado.",
      "auth.error.serverError": "Erro do servidor. Tenta novamente mais tarde.",
      "auth.error.oauthError": "Erro ao iniciar sessão com Google. Tenta novamente."
    },
    en: {
      "auth.signupTitle": "Create Account",
      "auth.signupSubtitle": "Join our community of travelers",
      "auth.namePlaceholder": "Your full name",
      "auth.emailPlaceholder": "Enter your email",
      "auth.passwordPlaceholder": "Enter your password",
      "auth.confirmPasswordPlaceholder": "Confirm your password",
      "auth.signupButton": "Create Account",
      "auth.signupLoading": "Creating account...",
      "auth.orContinueWith": "Or continue with",
      "auth.googleLogin": "Continue with Google",
      "auth.hasAccount": "Already have an account?",
      "auth.loginLink": "Log in",
      "auth.error.required": "This field is required.",
      "auth.error.invalidEmail": "Invalid email.",
      "auth.error.weakPassword": "Password must be at least 8 characters long.",
      "auth.error.passwordMismatch": "Passwords do not match.",
      "auth.error.emailExists": "This email is already registered.",
      "auth.error.serverError": "Server error. Please try again later.",
      "auth.error.oauthError": "Error logging in with Google. Please try again."
    },
    es: {
      "auth.signupTitle": "Crear Cuenta",
      "auth.signupSubtitle": "Únete a nuestra comunidad de viajeros",
      "auth.namePlaceholder": "Tu nombre completo",
      "auth.emailPlaceholder": "Introduzca su email",
      "auth.passwordPlaceholder": "Introduzca su contraseña",
      "auth.confirmPasswordPlaceholder": "Confirma tu contraseña",
      "auth.signupButton": "Crear Cuenta",
      "auth.signupLoading": "Creando cuenta...",
      "auth.orContinueWith": "O continuar con",
      "auth.googleLogin": "Continuar con Google",
      "auth.hasAccount": "¿Ya tienes cuenta?",
      "auth.loginLink": "Iniciar sesión",
      "auth.error.required": "Este campo es obligatorio.",
      "auth.error.invalidEmail": "Email inválido.",
      "auth.error.weakPassword": "La contraseña debe tener al menos 8 caracteres.",
      "auth.error.passwordMismatch": "Las contraseñas no coinciden.",
      "auth.error.emailExists": "Este email ya está registrado.",
      "auth.error.serverError": "Error del servidor. Intenta nuevamente más tarde.",
      "auth.error.oauthError": "Error al iniciar sesión con Google. Intenta nuevamente."
    },
    fr: {
      "auth.signupTitle": "Créer un Compte",
      "auth.signupSubtitle": "Rejoignez notre communauté de voyageurs",
      "auth.namePlaceholder": "Votre nom complet",
      "auth.emailPlaceholder": "Entrez votre email",
      "auth.passwordPlaceholder": "Entrez votre mot de passe",
      "auth.confirmPasswordPlaceholder": "Confirmez votre mot de passe",
      "auth.signupButton": "Créer un Compte",
      "auth.signupLoading": "Création de compte...",
      "auth.orContinueWith": "Ou continuez avec",
      "auth.googleLogin": "Continuer avec Google",
      "auth.hasAccount": "Vous avez déjà un compte ?",
      "auth.loginLink": "Se connecter",
      "auth.error.required": "Ce champ est obligatoire.",
      "auth.error.invalidEmail": "Email invalide.",
      "auth.error.weakPassword": "Le mot de passe doit comporter au moins 8 caractères.",
      "auth.error.passwordMismatch": "Les mots de passe ne correspondent pas.",
      "auth.error.emailExists": "Cet email est déjà enregistré.",
      "auth.error.serverError": "Erreur serveur. Veuillez réessayer plus tard.",
      "auth.error.oauthError": "Erreur lors de la connexion avec Google. Veuillez réessayer."
    },
    de: {
      "auth.signupTitle": "Konto Erstellen",
      "auth.signupSubtitle": "Werden Sie Teil unserer Reisegemeinschaft",
      "auth.namePlaceholder": "Ihr vollständiger Name",
      "auth.emailPlaceholder": "Geben Sie Ihre E-Mail-Adresse ein",
      "auth.passwordPlaceholder": "Geben Sie Ihr Passwort ein",
      "auth.confirmPasswordPlaceholder": "Bestätigen Sie Ihr Passwort",
      "auth.signupButton": "Konto Erstellen",
      "auth.signupLoading": "Konto wird erstellt...",
      "auth.orContinueWith": "Oder fortfahren mit",
      "auth.googleLogin": "Mit Google fortfahren",
      "auth.hasAccount": "Haben Sie bereits ein Konto?",
      "auth.loginLink": "Anmelden",
      "auth.error.required": "Dieses Feld ist erforderlich.",
      "auth.error.invalidEmail": "Ungültige E-Mail.",
      "auth.error.weakPassword": "Das Passwort muss mindestens 8 Zeichen lang sein.",
      "auth.error.passwordMismatch": "Die Passwörter stimmen nicht überein.",
      "auth.error.emailExists": "Diese E-Mail ist bereits registriert.",
      "auth.error.serverError": "Serverfehler. Bitte versuchen Sie es später erneut.",
      "auth.error.oauthError": "Fehler beim Anmelden mit Google. Bitte versuchen Sie es erneut."
    }
  };

  return translations[locale]?.[key] || translations.en[key] || key;
};

// Simple Button component (inline to avoid import issues)
const SimpleButton: React.FC<{
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ type = "button", variant = "primary", className = "", disabled = false, children, onClick }) => {
  const baseClasses = "w-full px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Simple Card component (inline to avoid import issues)
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

// Simple Loading Spinner (inline)
const SimpleSpinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

export default function SignupForm({ locale }: SignupFormProps) {
  const t = (key: string) => getTranslation(key, locale);
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Form validation
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

  // Handle form submission
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
          role: "customer",
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
        // Success - redirect to customer dashboard
        router.push(`/${locale}/customer`);
        router.refresh();
      }

    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: t("auth.error.serverError") });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/${locale}/customer`,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ general: t("auth.error.oauthError") });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("auth.signupTitle")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.signupSubtitle")}
        </p>
      </div>

      <SimpleCard className="p-8">
        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="sr-only">
              {t("auth.namePlaceholder")}
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
              placeholder={t("auth.namePlaceholder")}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">
              {t("auth.emailPlaceholder")}
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
              placeholder={t("auth.emailPlaceholder")}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">
              {t("auth.passwordPlaceholder")}
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
              placeholder={t("auth.passwordPlaceholder")}
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              {t("auth.confirmPasswordPlaceholder")}
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
              placeholder={t("auth.confirmPasswordPlaceholder")}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <SimpleButton
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <SimpleSpinner />
                <span className="ml-2">{t("auth.signupLoading")}</span>
              </div>
            ) : (
              t("auth.signupButton")
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
                {t("auth.orContinueWith")}
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
                {t("auth.googleLogin")}
              </div>
            </SimpleButton>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("auth.hasAccount")}{" "}
            <a
              href={`/${locale}/auth/login`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("auth.loginLink")}
            </a>
          </p>
        </div>
      </SimpleCard>
    </div>
  );
}