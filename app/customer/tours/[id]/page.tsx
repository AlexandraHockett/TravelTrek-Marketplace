// File: app/customer/tours/[id]/page.tsx
// Location: Create this file in the app/customer/tours/[id]/ directory

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tour, ItineraryItem } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

// Mock data - replace with actual API calls later
const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Porto Food & Wine Tour",
    description:
      "Embark on a culinary journey through Portos historic streets and discover the authentic flavors of Portuguese cuisine. This guided tour takes you to family-run restaurants, traditional markets, and local wine bars where youll sample the best of what Porto has to offer. From francesinha sandwiches to port wine, experience the citys gastronomic heritage with a knowledgeable local guide who will share stories and traditions passed down through generations.",
    shortDescription: "Authentic Portuguese cuisine tour",
    image: "/images/porto-food.webp",
    images: [
      "/images/porto-food.webp",
      "/images/porto-food-2.webp",
      "/images/porto-food-3.webp",
      "/images/porto-food-4.webp",
    ],
    price: 45,
    originalPrice: 60,
    currency: "EUR",
    duration: 4,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 128,
    maxParticipants: 12,
    minimumAge: 18,
    difficulty: "Easy" as const,
    included: [
      "Professional local guide",
      "Food tastings at 5 different venues",
      "Port wine and green wine samples",
      "Traditional Portuguese dessert",
      "Market visit with local produce tasting",
      "Recipe cards to take home",
    ],
    excluded: [
      "Hotel pickup and drop-off",
      "Additional drinks beyond tastings",
      "Gratuities",
      "Personal expenses",
    ],
    itinerary: [
      {
        time: "10:00",
        title: "Meeting Point - Livraria Lello",
        description:
          "Meet your guide at the famous Livraria Lello bookstore and receive a brief introduction to Porto's culinary history.",
      },
      {
        time: "10:30",
        title: "Mercado do Bolhão",
        description:
          "Explore the traditional market, meet local vendors, and taste fresh seasonal fruits and vegetables.",
      },
      {
        time: "11:30",
        title: "Traditional Tasca",
        description:
          "Visit an authentic Portuguese tavern for petiscos (Portuguese tapas) and green wine tasting.",
      },
      {
        time: "12:30",
        title: "Francesinha Experience",
        description:
          "Try Porto's most famous sandwich at a local favorite restaurant, paired with local beer.",
      },
      {
        time: "13:30",
        title: "Port Wine Cellar",
        description:
          "Discover the secrets of port wine production and enjoy a guided tasting of different varieties.",
      },
      {
        time: "14:00",
        title: "Sweet Finale",
        description:
          "End the tour with traditional Portuguese pastries and coffee at a historic café.",
      },
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the tour starts. 50% refund if cancelled within 24 hours. No refund for no-shows.",
    hostId: "h1",
    tags: ["Food", "Wine", "Culture", "Walking Tour"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
];

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    customerName: "Maria Santos",
    rating: 5,
    comment:
      "Experiência fantástica! O guia conhecia todos os melhores sítios e a comida estava deliciosa. Recomendo vivamente!",
    date: "2025-08-15",
    verified: true,
  },
  {
    id: "r2",
    customerName: "John Smith",
    rating: 5,
    comment:
      "Amazing food tour! Got to try authentic Portuguese dishes I never would have found on my own. The port wine tasting was exceptional.",
    date: "2025-08-10",
    verified: true,
  },
  {
    id: "r3",
    customerName: "Claire Dubois",
    rating: 4,
    comment:
      "Très belle découverte culinaire! Le guide était passionné et les dégustations variées. Seul bémol: un peu trop de marche pour moi.",
    date: "2025-08-05",
    verified: true,
  },
];

interface TourDetailPageProps {
  params: {
    id: string;
  };
}

interface BookingFormProps {
  tour: Tour;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const [selectedDate, setSelectedDate] = React.useState("");
  const [participants, setParticipants] = React.useState(1);
  const [specialRequests, setSpecialRequests] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const totalAmount = participants * tour.price;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Por favor selecciona uma data.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would create a booking via API
      alert(
        `Reserva criada com sucesso para ${participants} pessoa${participants > 1 ? "s" : ""} em ${new Date(selectedDate).toLocaleDateString("pt-PT")}!`
      );

      // Redirect to bookings page
      window.location.href = "/customer/bookings";
    } catch (error) {
      alert("Erro ao criar reserva. Tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-6 p-6">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(tour.price)}
          </span>
          <span className="text-gray-600">/pessoa</span>
        </div>
        {tour.originalPrice && (
          <p className="text-sm text-gray-500">
            Preço original:{" "}
            <span className="line-through">
              {formatCurrency(tour.originalPrice)}
            </span>
            <Badge variant="error" className="ml-2 bg-green-100 text-green-800">
              Poupa {formatCurrency(tour.originalPrice - tour.price)}!
            </Badge>
          </p>
        )}
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data da Experiência *
          </label>
          <input
            type="date"
            value={selectedDate}
            min={minDate.toISOString().split("T")[0]}
            max={maxDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Participantes *
          </label>
          <select
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: tour.maxParticipants }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} pessoa{num > 1 ? "s" : ""}
                </option>
              )
            )}
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pedidos Especiais (Opcional)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Alergias, necessidades especiais, etc."
          />
        </div>

        {/* Total */}
        {participants > 1 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {formatCurrency(tour.price)} × {participants} participantes
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading
            ? "A processar..."
            : `Reservar${participants > 1 ? ` (${formatCurrency(totalAmount)})` : ""}`}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          Não será cobrado nada ainda. Confirma os detalhes antes do pagamento.
        </p>
      </form>
    </Card>
  );
};

interface ImageGalleryProps {
  tour: Tour;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ tour }) => {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const images = tour.images || [tour.image];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={tour.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholders/tour-placeholder.webp";
          }}
        />
        {tour.originalPrice && tour.originalPrice > tour.price && (
          <div className="absolute top-4 left-4">
            <Badge variant="error" className="bg-green-500">
              -
              {Math.round(
                ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
              )}
              % DESCONTO
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden ${
                selectedImage === index
                  ? "ring-2 ring-blue-500"
                  : "hover:opacity-80"
              }`}
            >
              <img
                src={image}
                alt={`${tour.title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ItineraryProps {
  itinerary: ItineraryItem[];
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-900">Itinerário</h3>
    <div className="space-y-4">
      {itinerary.map((item, index) => (
        <div key={index} className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">{item.time}</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface ReviewsProps {
  reviews: any[];
  rating: number;
  reviewCount: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, rating, reviewCount }) => {
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-900">Avaliações</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl text-yellow-500">★</span>
          <span className="text-xl font-semibold">{rating}</span>
          <span className="text-gray-600">({reviewCount} avaliações)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, 3).map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {review.customerName}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">
                    {renderStars(review.rating)}
                  </span>
                  {review.verified && (
                    <Badge
                      variant="default"
                      size="sm"
                      className="text-green-600 border-green-200"
                    >
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString("pt-PT")}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </Card>
        ))}
      </div>

      {reviewCount > 3 && (
        <Button variant="default" className="w-full">
          Ver todas as {reviewCount} avaliações
        </Button>
      )}
    </div>
  );
};

export default function TourDetailPage({ params }: TourDetailPageProps) {
  // In a real app, fetch tour data based on params.id
  const tour = mockTours.find((t) => t.id === params.id);

  if (!tour) {
    notFound();
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "Fácil";
      case "Moderate":
        return "Moderada";
      case "Challenging":
        return "Desafiante";
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Moderate":
        return "warning";
      case "Challenging":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/customer/tours" className="hover:text-blue-600">
              Tours
            </Link>
            <span>→</span>
            <span className="text-gray-900">{tour.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery tour={tour} />

            {/* Basic Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant={getDifficultyColor(tour.difficulty) as any}>
                  {getDifficultyLabel(tour.difficulty)}
                </Badge>
                <Badge variant="default">{tour.duration} horas</Badge>
                <Badge variant="default">
                  Até {tour.maxParticipants} pessoas
                </Badge>
                {tour.minimumAge && (
                  <Badge variant="default">+{tour.minimumAge} anos</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {tour.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg mr-1">★</span>
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-gray-600 ml-1">
                    ({tour.reviewCount} avaliações)
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-1">📍</span>
                  {tour.location}
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Incluído
                </h3>
                <ul className="space-y-2">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {tour.excluded && tour.excluded.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-red-500 mr-2">✗</span>
                    Não Incluído
                  </h3>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1">✗</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <Card className="p-6">
                <Itinerary itinerary={tour.itinerary} />
              </Card>
            )}

            {/* Cancellation Policy */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Política de Cancelamento
              </h3>
              <p className="text-gray-700">{tour.cancellationPolicy}</p>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <Reviews
                reviews={mockReviews}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
              />
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingForm tour={tour} />
          </div>
        </div>
      </div>
    </div>
  );
}
