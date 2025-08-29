// File: next.config.js (App Router Compatible)
// Location: Replace the existing next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVER i18n config (não funciona com App Router)
  // App Router usa approach diferente para internationalization

  // Optimização de imagens
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects automáticos
  async redirects() {
    return [
      // Corrigir typo comum
      {
        source: "/customers/:path*",
        destination: "/customer/:path*",
        permanent: true,
      },
      // Redirect /tours para /customer/tours
      {
        source: "/tours",
        destination: "/customer/tours",
        permanent: true,
      },
    ];
  },

  // Configurações experimentais
  experimental: {
    // Podem ser removidas quando estáveis
  },
};

module.exports = nextConfig;
