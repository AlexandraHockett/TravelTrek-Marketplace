// File: app\[locale]\page.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getTranslations } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const benefits = [
    {
      icon: "🗺️",
      title: t.benefits?.localExperiences?.title || "Local Experiences",
      description:
        t.benefits?.localExperiences?.description ||
        "Discover the city's secrets through the eyes of those who know it best.",
    },
    {
      icon: "👥",
      title: t.benefits?.verifiedHosts?.title || "Verified Hosts",
      description:
        t.benefits?.verifiedHosts?.description ||
        "All our local guides are verified and highly qualified.",
    },
    {
      icon: "💰",
      title: t.benefits?.fairPrices?.title || "Fair Prices",
      description:
        t.benefits?.fairPrices?.description ||
        "No hidden fees. What you see is what you pay.",
    },
    {
      icon: "🌟",
      title: t.benefits?.qualityGuaranteed?.title || "Quality Guaranteed",
      description:
        t.benefits?.qualityGuaranteed?.description ||
        "Unique experiences with 5-star ratings.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-teal-500 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            {t.hero?.title || "Discover the "}
            <span className="gradient-text">
              {t.hero?.highlight || "Extraordinary"}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            {t.hero?.subtitle ||
              "Connect with local hosts and discover authentic experiences. From urban walks to nature expeditions."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/customer/tours`}>
              <Button
                size="lg"
                variant="primary"
                className="transform hover:scale-105 transition-all duration-300"
              >
                {t.nav?.exploreTours || "Explore Tours"}
              </Button>
            </Link>
            <Link href={`/${locale}/host`}>
              <Button
                size="lg"
                variant="secondary"
                className="transform hover:scale-105 transition-all duration-300"
              >
                {t.hero?.becomeHostButton || "Become a Host"}
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                {t.search?.title || "Find Your Perfect Tour"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search?.destinationLabel || "Destination"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      t.search?.destinationPlaceholder || "Where to?"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search?.checkInLabel || "Check-in"}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search?.participantsLabel || "Participants"}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>
                      {t.search?.participantsOptions?.one || "1 person"}
                    </option>
                    <option>
                      {t.search?.participantsOptions?.two || "2 people"}
                    </option>
                    <option>
                      {t.search?.participantsOptions?.three || "3 people"}
                    </option>
                    <option>
                      {t.search?.participantsOptions?.fourPlus || "4+ people"}
                    </option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full text-black"
                    size="lg"
                    variant="primary"
                  >
                    {t.search?.searchButton || "Search"}
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
              {t.benefits?.title || "Why Choose TravelTrek?"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.benefits?.subtitle ||
                "We make it easy to discover and book incredible travel experiences"}
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
              {t.hostCta?.title || "Share Your Local Knowledge"}
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              {t.hostCta?.subtitle ||
                "Join our community of local hosts and turn your passion for your city into income. Create unique tours and share unforgettable experiences with travelers."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/host`}>
                <Button
                  size="lg"
                  variant="primary"
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  {t.hostCta?.startTodayButton || "Start Today"}
                </Button>
              </Link>
              <Link href={`/${locale}/host/earnings`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  {t.hostCta?.learnEarningsButton || "Learn About Earnings"}
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
              <div className="text-gray-600 font-medium">
                {t.statistics?.happyTravelers || "Happy Travelers"}
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                500+
              </div>
              <div className="text-gray-600 font-medium">
                {t.statistics?.uniqueTours || "Unique Tours"}
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-gray-600 font-medium">
                {t.statistics?.citiesWorldwide || "Cities Worldwide"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
