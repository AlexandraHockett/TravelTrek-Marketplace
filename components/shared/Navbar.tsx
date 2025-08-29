"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import {
  languages,
  getLocaleFromPathname,
  getLocalizedHref,
  getLocaleFromCookie,
  setLocaleCookie,
  removeLocaleFromPathname,
  type Locale,
} from "@/lib/i18n";

// Definição de tipo para as traduções
interface Translations {
  nav?: {
    [key: string]: string;
  };
  // Adicione outras seções do dicionário, se necessário
}

// Função para obter traduções no client-side
async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/locales/${locale}.json`);
    return translations.default as Translations;
  } catch {
    // Fallback para inglês (en.json)
    const translations = await import(`@/locales/en.json`);
    return translations.default as Translations;
  }
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentLocale, setCurrentLocale] = useState<Locale>("pt");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [t, setTranslations] = useState<Translations>({}); // Estado tipado

  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  // Carregar traduções e locale ao montar o componente
  useEffect(() => {
    const loadTranslations = async () => {
      const pathLocale =
        getLocaleFromPathname(pathname) || getLocaleFromCookie() || "pt";
      setCurrentLocale(pathLocale as Locale);
      const translations = await getTranslations(pathLocale);
      setTranslations(translations);
    };
    loadTranslations();
  }, [pathname]);

  // Links de navegação com chaves de tradução
  const navLinks = [
    { href: "/customer/tours", key: "nav.exploreTours" },
    { href: "/customer/bookings", key: "nav.myBookings" },
    { href: "/host", key: "nav.hostPortal" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setIsMenuOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".language-menu") &&
        !target.closest(".language-toggle")
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isTabletView = windowWidth >= 768 && windowWidth <= 1024;

  // Função para trocar idioma
  const switchLanguage = (newLocale: Locale) => {
    setLocaleCookie(newLocale);
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    router.push(newPath);
    setIsLanguageMenuOpen(false);
    setIsMenuOpen(false); // Fecha o menu mobile ao mudar idioma
  };

  return (
    <>
      <nav
        className={cn(
          "bg-white sticky top-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "shadow-md py-2 border-b border-gray-100"
            : "shadow-sm py-3"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${currentLocale}`}
            className="flex items-center space-x-2 z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">TT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              TravelTrek
            </span>
          </Link>

          {/* Desktop Navigation and Actions */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${currentLocale}${link.href}`}
                className={cn(
                  "text-gray-700 hover:text-blue-600 transition-colors font-medium relative py-2",
                  pathname === `/${currentLocale}${link.href}`
                    ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
                    : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-400 hover:after:rounded-full after:transition-all after:duration-300"
                )}
              >
                {t.nav
                  ? t.nav[
                      link.key.split(".").pop() ??
                        (link.key.split(".").pop() || "unknown")
                    ]
                  : link.key.split(".").pop() || "unknown"}
              </Link>
            ))}
            <div className="relative language-menu">
              <button
                onClick={toggleLanguageMenu}
                className="language-toggle flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-all duration-300"
              >
                <span>{languages[currentLocale]?.flag}</span>
                <span>{languages[currentLocale]?.name}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isLanguageMenuOpen ? "rotate-180" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {Object.entries(languages).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => switchLanguage(code as Locale)}
                      className={cn(
                        "w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors",
                        currentLocale === code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      )}
                    >
                      <span>{config.flag}</span>
                      <span>{config.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 ml-6">
              <Link href={`/${currentLocale}/auth/login`}>
                <Button variant="outline" size="sm" className="rounded-lg">
                  {t.nav?.login || "Entrar"}
                </Button>
              </Link>
              <Link href={`/${currentLocale}/auth/signup`}>
                <Button
                  size="sm"
                  className="rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  {t.nav?.signup || "Registrar"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet Right Section */}
          <div className="lg:hidden flex items-center space-x-4">
            {isTabletView && (
              <div className="flex items-center space-x-2">
                <Link href={`/${currentLocale}/auth/login`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs"
                  >
                    {t.nav?.login || "Entrar"}
                  </Button>
                </Link>
                <Link href={`/${currentLocale}/auth/signup`}>
                  <Button
                    size="sm"
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    {t.nav?.signup || "Registrar"}
                  </Button>
                </Link>
              </div>
            )}
            <button
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transform transition duration-300 ease-in-out",
                    isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transition duration-300 ease-in-out",
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transform transition duration-300 ease-in-out",
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
          <div className="flex flex-col space-y-6 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${currentLocale}${link.href}`}
                className={cn(
                  "text-lg font-medium py-2 px-3 rounded-lg transition-colors",
                  pathname === `/${currentLocale}${link.href}`
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav
                  ? t.nav[
                      link.key.split(".").pop() ??
                        (link.key.split(".").pop() || "unknown")
                    ]
                  : link.key.split(".").pop() || "unknown"}
              </Link>
            ))}
          </div>

          {/* Mobile Language Selector */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {t.nav?.language || "Idioma"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(languages).map(([code, config]) => (
                <button
                  key={code}
                  onClick={() => switchLanguage(code as Locale)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border transition-colors",
                    currentLocale === code
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{config.flag}</span>
                  <span>{config.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-auto space-y-3">
            <Link
              href={`/${currentLocale}/auth/login`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center rounded-lg"
              >
                {t.nav?.login || "Entrar"}
              </Button>
            </Link>
            <Link
              href={`/${currentLocale}/auth/signup`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                size="sm"
                className="w-full justify-center rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {t.nav?.signup || "Registrar"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
