// File: app/page.tsx (App Router Compatible)
// Location: Replace the existing app/page.tsx

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  // For now, keep it simple in Portuguese until we set up the full i18n structure
  // The middleware will handle language redirects

  const benefits = [
    {
      icon: "🗺️",
      title: "Experiências Locais",
      description:
        "Descobre os segredos da cidade através dos olhos de quem a conhece melhor.",
    },
    {
      icon: "👥",
      title: "Anfitriões Verificados",
      description:
        "Todos os nossos guias locais são verificados e altamente qualificados.",
    },
    {
      icon: "💰",
      title: "Preços Justos",
      description: "Sem taxas escondidas. O que vês é o que pagas.",
    },
    {
      icon: "🌟",
      title: "Qualidade Garantida",
      description: "Experiências únicas com classificações de 5 estrelas.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-teal-500 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Descobre o <span className="gradient-text">Extraordinário</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Conecta-te com anfitriões locais e descobre experiências autênticas.
            Das caminhadas urbanas às expedições na natureza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer/tours">
              <Button
                size="lg"
                variant="primary"
                className="transform hover:scale-105 transition-all duration-300"
              >
                Explorar Tours
              </Button>
            </Link>
            <Link href="/host">
              <Button
                size="lg"
                variant="secondary"
                className="transform hover:scale-105 transition-all duration-300"
              >
                Tornar-me Anfitrião
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                Encontra o Teu Tour Perfeito
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <input
                    type="text"
                    placeholder="Para onde?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participantes
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1 pessoa</option>
                    <option>2 pessoas</option>
                    <option>3 pessoas</option>
                    <option>4+ pessoas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" size="lg" variant="primary">
                    Pesquisar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Porque Escolher a TravelTrek?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Facilitamos a descoberta e reserva de experiências de viagem
              incríveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Partilha o Teu Conhecimento Local
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Junta-te à nossa comunidade de anfitriões locais e transforma a
              tua paixão pela tua cidade em rendimento. Cria tours únicos e
              partilha experiências inesquecíveis com viajantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/host">
                <Button
                  size="lg"
                  variant="primary"
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  Começar Hoje
                </Button>
              </Link>
              <Link href="/host/earnings">
                <Button
                  size="lg"
                  variant="secondary"
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  Saber Sobre Ganhos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                10k+
              </div>
              <div className="text-gray-600 font-medium">Viajantes Felizes</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                500+
              </div>
              <div className="text-gray-600 font-medium">Tours Únicos</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-gray-600 font-medium">
                Cidades Mundialmente
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
