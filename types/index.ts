// File: types/index.ts
// Location: SUBSTITUIR o ficheiro existente types/index.ts

export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  duration: number; // in hours
  location: string;
  rating: number;
  reviewCount: number;
  maxParticipants: number;
  minimumAge?: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  included: string[];
  excluded?: string[];
  itinerary?: ItineraryItem[];
  cancellationPolicy: string;
  hostId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourDescription: string;
  tourImage: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostEmail: string;
  hostPhone: string;
  hostVerified: boolean;
  hostResponseTime: string;
  date: string;
  time: string;
  participants: number;
  basePrice: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  specialRequests?: string;
  meetingPoint: string;
  cancellationPolicy: string;
  createdAt: string;
  updatedAt: string;
  serviceFees: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "host";
  createdAt: string;
}

// File: types/index.ts
// Location: ACTUALIZAR a interface Translations existente

export interface Translations {
  nav?: {
    home: string;
    tours: string;
    bookings: string;
    profile: string;
    host: string;
    login: string;
    signup: string;
    [key: string]: string;
  };
  common?: {
    person: string;
    persons: string;
    hours: string;
    hour: string;
    from: string;
    to: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    processing: string;
    total: string;
    back: string; // ✅ ADICIONADO
    and: string;
    optional: string;
    save: string;
    edit: string;
    delete: string;
    view: string;
    close: string;
    [key: string]: string;
  };
  bookingForm?: {
    requiredDate: string;
    minDateTomorrow: string;
    maxDateThreeMonths: string;
    minParticipants: string;
    maxParticipants: string;
    maxSpecialRequestsLength: string;
    bookButton: string;
    processing: string;
    perPerson: string;
    save: string;
    includedTaxes: string;
    freeCancellation: string;
    bookingError: string;
    allergiesPlaceholder: string;
    maxPersons: string;
    bookForMultiple: string;
    noChargeYet: string;
    experienceDate: string;
    participants: string;
    specialRequests: string;
    bookExperience: string;
    originalPrice: string;
    continueToPayment: string;
    agreeToTerms: string;
    termsOfService: string;
    privacyPolicy: string;
    total: string;
    serviceFees: string;
    included: string;
    instantConfirmation: string; // ✅ ADICIONADO
    [key: string]: string;
  };
  tourDetails?: {
    // ✅ ADICIONADO COMPLETO
    difficulty: {
      easy: string;
      moderate: string;
      challenging: string;
      [key: string]: string;
    };
    reviews: string;
    overview: string;
    itinerary: string;
    included: string;
    excluded: string;
    importantInfo: string;
    maxParticipants: string;
    minAge: string;
    years: string;
    cancellationPolicy: string;
    detailedItinerary: string;
    customerReviews: string;
    noReviewsYet: string;
    beFirstReview: string;
    needHelp: string;
    contactSupport: string;
    contactUs: string;
    hostInfo: string;
    verified: string;
    responseTime: string;
    bookNow: string;
    checkAvailability: string;
    addToWishlist: string;
    removeFromWishlist: string;
    shareExperience: string;
    whatYouWillDo: string;
    meetingPoint: string;
    duration: string;
    groupSize: string;
    languages: string;
    provided: string;
    bring: string;
    notSuitableFor: string;
    weatherDependent: string;
    accessibilityInfo: string;
    safetyMeasures: string;
    experience: string;
    [key: string]: string | object;
  };
  tours?: {
    searchPlaceholder: string;
    result: string;
    results: string;
    filters: string;
    filteredBy: string;
    clearFilters: string;
    noResults: string;
    noResultsDescription: string;
    perPerson: string;
    upTo: string;
    viewDetails: string;
    addToWishlist: string;
    removeFromWishlist: string;
    availableTours: string;
    averageRating: string;
    totalReviews: string;
    destinations: string;
    popularCategories: string;
    priceRange: string;
    location: string;
    allLocations: string;
    allDifficulties: string;
    sortBy: string;
    difficulty?: {
      label: string;
      easy: string;
      moderate: string;
      challenging: string;
      [key: string]: string;
    };
    sort?: {
      newest: string;
      popular: string;
      priceAsc: string;
      priceDesc: string;
      rating: string;
      duration: string;
      [key: string]: string;
    };
    categories?: {
      food: string;
      culture: string;
      nature: string;
      adventure: string;
      history: string;
      beaches: string;
      wine: string;
      walking: string;
      family: string;
      art: string;
      nightlife: string;
      [key: string]: string;
    };
    hostCta?: {
      title: string;
      description: string;
      button: string;
    };
    [key: string]: string | object | undefined;
  };
  bookingDetails?: {
    bookingDetails: string;
    bookingInformation: string;
    hostInformation: string;
    importantInformation: string;
    actions: string;
    paymentCompleted: string;
    paymentCompletedDescription: string;
    paymentPending: string;
    paymentPendingDescription: string;
    payNow: string;
    serviceFees: string;
    included: string;
    viewTourDetails: string;
    viewTour: string;
    contactHost: string;
    cancelBooking: string;
    leaveReview: string;
    responseTime: string;
    confirmedBooking: string;
    meetingInstructions: string;
    cancellationPolicy: string;
    cancellationDescription: string;
    cancelReasonRequired: string;
    cancelDescription: string;
    refundInfo: string;
    willBeRefunded: string;
    cancelReason: string;
    cancelReasonPlaceholder: string;
    confirmCancel: string;
    cancelSuccess: string;
    cancelError: string;
    redirectingPayment: string;
    paymentError: string;
    contactHostMessage: string;
    partialRefund: string;
    noRefund: string;
    paymentInstructions: string;
    pendingMessage: string;
    confirmedMessage: string;
    completedMessage: string;
    cancelledMessage: string;
    time: string;
    meetingPoint: string;
    needHelp: string;
    supportMessage: string;
    contactSupport: string;
    tourDescription?: {
      [key: string]: string;
    };
    specialRequests?: {
      [key: string]: string;
    };
    meetingPointDetails?: {
      [key: string]: string;
    };
    cancellationPolicyDetails?: {
      [key: string]: string;
    };
    [key: string]: string | object | undefined;
  };
  bookingList?: {
    pending: string;
    confirmed: string;
    completed: string;
    cancelled: string;
    pendingPayment: string;
    paid: string;
    refunded: string;
    viewDetails: string;
    pay: string;
    cancel: string;
    rebook: string;
    bookingNumber: string;
    date: string;
    participants: string;
    totalAmount: string;
    specialRequests: string;
    createdAt: string;
    next: string;
    person: string;
    persons: string;
    noBookings: string;
    view: string;
    vegetarianRequest: string;
    pendingLabel: string;
    confirmedLabel: string;
    completedLabel: string;
    cancelledLabel: string;
    leaveReview: string;
    [key: string]: string;
  };
  pages?: {
    customerBookings?: {
      title: string;
      subtitle: string;
      description: string;
      totalBookings: string;
      noBookingsDescription: string;
      browseTours: string;
      confirmCancel: string;
      cancelSuccess: string;
      cancelError: string;
      redirectingPayment: string;
      paymentError: string;
      searchPlaceholder: string;
      noResults: string;
      clearFilters: string;
      upcomingExperiences: string;
      noResultsTitle: string;
      noResultsDescription: string;
      allBookingsButton: string;
      filters?: {
        all: string;
        bookingStatusLabel: string;
        sortByLabel: string;
        [key: string]: string;
      };
      sort?: {
        dateDesc: string;
        dateAsc: string;
        amountDesc: string;
        amountAsc: string;
        status: string;
        createdDesc: string;
        [key: string]: string;
      };
      stats?: {
        totalBookings: string;
        upcoming: string;
        totalSpent: string;
        [key: string]: string;
      };
      [key: string]: string | object | undefined;
    };
    customerTours?: {
      // ✅ ADICIONADO
      title: string;
      subtitle: string;
      description: string;
      [key: string]: string;
    };
    hostDashboard?: {
      title: string;
      subtitle: string;
      [key: string]: string;
    };
    bookingDetail?: {
      title: string;
      description: string;
      [key: string]: string;
    };
    notFound?: {
      title: string;
      description: string;
      [key: string]: string;
    };
    home?: {
      title: string;
      description: string;
      hero: {
        title: string;
        subtitle: string;
        cta: string;
        [key: string]: string;
      };
      [key: string]: string | object;
    };
    status?: {
      [key: string]: string | object;
    };
    [key: string]: object | undefined;
  };
  footer?: {
    brand?: {
      description: string;
      [key: string]: string;
    };
    explore?: {
      title: string;
      links?: {
        tours: string;
        destinations: string;
        experiences: string;
        [key: string]: string;
      };
      [key: string]: string | object | undefined;
    };
    host?: {
      title: string;
      links?: {
        portal: string;
        earnings: string;
        bookings: string;
        [key: string]: string;
      };
      [key: string]: string | object | undefined;
    };
    support?: {
      title: string;
      links?: {
        help: string;
        contact: string;
        terms: string;
        privacy: string;
        [key: string]: string;
      };
      [key: string]: string | object | undefined;
    };
    [key: string]: object | undefined;
  };
  errors?: {
    generic: string;
    network: string;
    notFound: string;
    unauthorized: string;
    validation: string;
    [key: string]: string;
  };
  [key: string]: object | undefined;
}

// ✅ CORRIGIR BookingFormProps para aceitar tour
export type BookingFormProps = {
  tour: Tour;
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: "default" | "compact" | "minimal";
};

export interface PaymentButtonProps {
  bookingId?: string;
  amount: number;
  currency?: string;
  variant?: "default" | "primary" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  tourTitle?: string;
  tourId?: string;
  participants?: number;
  date?: string;
}

export interface PaymentData {
  bookingId?: string;
  tourId?: string;
  amount: number;
  currency: string;
  participants?: number;
  date?: string;
  successUrl?: string;
  cancelUrl?: string;
}

// Export specific prop types
export type TourCardProps = {
  tour: Tour;
  locale: string;
  translations: Translations;
  compact?: boolean;
  className?: string;
};

export type BookingListProps = {
  bookings: Booking[];
  locale: string;
  translations: Translations;
  onCancelBooking?: (bookingId: string) => void;
  onPayBooking?: (bookingId: string) => void;
  className?: string;
};

// Utility types
export type Locale = "pt" | "en" | "es" | "fr" | "de";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type TourDifficulty = "Easy" | "Moderate" | "Challenging";

export type UserRole = "customer" | "host";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export interface BasePageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface DetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}
