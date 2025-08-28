// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const featuredTours = [
    {
      id: "1",
      title: "Ancient Rome Walking Tour",
      location: "Rome, Italy",
      price: 45,
      rating: 4.8,
      image: "/images/rome-tour.jpg",
      duration: "3 hours",
    },
    {
      id: "2",
      title: "Sunset Safari Adventure",
      location: "Serengeti, Tanzania",
      price: 120,
      rating: 4.9,
      image: "/images/safari-tour.jpg",
      duration: "6 hours",
    },
    {
      id: "3",
      title: "Northern Lights Experience",
      location: "Reykjavik, Iceland",
      price: 89,
      rating: 4.7,
      image: "/images/northern-lights.jpg",
      duration: "4 hours",
    },
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Global Adventures",
      description:
        "Discover unique tours and experiences from around the world",
    },
    {
      icon: "💰",
      title: "Best Prices",
      description:
        "Compare prices and find the best deals on tours and activities",
    },
    {
      icon: "⭐",
      title: "Verified Reviews",
      description: "Read authentic reviews from real travellers like you",
    },
    {
      icon: "🛡️",
      title: "Secure Booking",
      description: "Book with confidence using our secure payment system",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your Next
              <span className="text-secondary"> Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Connect with local tour guides and experience authentic adventures
              around the globe. From city walks to wilderness expeditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/customer/tours"
                className="bg-secondary hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
              >
                Browse Tours
              </Link>
              <Link
                href="/host"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                Become a Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
                Find Your Perfect Tour
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3+ Guests</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-primary hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular tours and experiences, handpicked by our
              travel experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredTours.map((tour) => (
              <Link
                href={`/customer/tours/${tour.id}`}
                key={tour.id}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <div className="relative h-56 bg-gradient-to-br from-gray-300 to-gray-400">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      <span className="text-sm">Tour Image Placeholder</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-gray-900">
                        ⭐ {tour.rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-primary">
                        {tour.location}
                      </span>
                      <span className="text-sm text-gray-500">
                        {tour.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        £{tour.price}
                        <span className="text-sm font-normal text-gray-500">
                          {" "}
                          /person
                        </span>
                      </span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/customer/tours"
              className="inline-flex items-center bg-primary hover:bg-blue-900 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              View All Tours
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelTrek?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to discover and book amazing travel experiences
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
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Share Your Local Knowledge
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join our community of local hosts and turn your passion for your
              city into income. Create unique tours and share unforgettable
              experiences with travellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/host"
                className="bg-secondary hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Hosting Today
              </Link>
              <Link
                href="/host/earnings"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                Learn About Earnings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-gray-600 font-medium">Happy Travellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 font-medium">Unique Tours</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 font-medium">Cities Worldwide</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
