import React from "react";
import Link from "next/link";

// Definindo o tipo das props
interface FooterProps {
  params: {
    locale: string;
  };
}

// Função para obter traduções no server-side
async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/locales/${locale}.json`);
    return translations.default;
  } catch {
    // Fallback para inglês (en.json)
    const translations = await import(`@/locales/en.json`);
    return translations.default;
  }
}

const Footer: React.FC<FooterProps> = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations(locale);
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t.footer?.explore?.title || "Explorar",
      links: [
        {
          href: "/customer/tours",
          label: t.footer?.explore?.links?.tours || "Tours",
        },
        {
          href: "/customer/destinations",
          label: t.footer?.explore?.links?.destinations || "Destinos",
        },
        {
          href: "/customer/experiences",
          label: t.footer?.explore?.links?.experiences || "Experiências",
        },
      ],
    },
    {
      title: t.footer?.host?.title || "Anfitrião",
      links: [
        {
          href: "/host",
          label: t.footer?.host?.links?.portal || "Portal Anfitrião",
        },
        {
          href: "/host/earnings",
          label: t.footer?.host?.links?.earnings || "Ganhos",
        },
        {
          href: "/host/bookings",
          label: t.footer?.host?.links?.bookings || "Reservas",
        },
      ],
    },
    {
      title: t.footer?.support?.title || "Suporte",
      links: [
        {
          href: "/help",
          label: t.footer?.support?.links?.help || "Centro de Ajuda",
        },
        {
          href: "/contact",
          label: t.footer?.support?.links?.contact || "Contactar",
        },
        {
          href: "/terms",
          label: t.footer?.support?.links?.terms || "Termos de Uso",
        },
        {
          href: "/privacy",
          label: t.footer?.support?.links?.privacy || "Privacidade",
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">
                  TT
                </span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                TravelTrek
              </span>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 max-w-xs sm:max-w-sm">
              {t.footer?.brand?.description ||
                "Descobre as melhores experiências de viagem e conecta-te com anfitriões locais únicos."}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zm5.568 16.835c-.377.372-.883.564-1.414.564H7.868c-.531 0-1.037-.192-1.414-.564s-.564-.883-.564-1.414V7.868c0-.531.187-1.037.564-1.414s.883-.564 1.414-.564h8.303c.531 0 1.037.192 1.414.564s.564.883.564 1.414v8.553c0 .531-.187 1.042-.564 1.414zM12.017 7.075c-2.717 0-4.913 2.196-4.913 4.913s2.196 4.913 4.913 4.913 4.913-2.196 4.913-4.913-2.196-4.913-4.913-4.913z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-white font-semibold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm lg:text-base text-gray-400 text-center sm:text-left">
            © {currentYear} {t.footer?.brand?.copyright || "TravelTrek"}.{" "}
            {t.footer?.brand?.rights || "Todos os direitos reservados."}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-6">
            <Link
              href="/privacy"
              className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
            >
              {t.footer?.bottom?.privacy || "Política de Privacidade"}
            </Link>
            <Link
              href="/terms"
              className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
            >
              {t.footer?.bottom?.terms || "Termos de Serviço"}
            </Link>
            <Link
              href="/cookies"
              className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
            >
              {t.footer?.bottom?.cookies || "Cookies"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
