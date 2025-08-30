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

export interface Translations {
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
  };
  nav?: {
    [key: string]: string;
  };
  footer?: {
    brand?: {
      description: string;
    };
    explore?: {
      title: string;
      links?: {
        tours: string;
        destinations: string;
        experiences: string;
      };
    };
    host?: {
      title: string;
      links?: {
        portal: string;
        earnings: string;
        bookings: string;
      };
    };
    support?: {
      title: string;
      links?: {
        help: string;
        contact: string;
        terms: string;
        privacy: string;
      };
    };
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
      };
      sort?: {
        dateDesc: string;
        dateAsc: string;
        amountDesc: string;
        amountAsc: string;
        status: string;
        createdDesc: string;
      };
      stats?: {
        totalBookings: string;
        upcoming: string;
        totalSpent: string;
      };
    };
    customerTours?: {
      title: string;
      subtitle: string;
      description: string;
    };
    hostDashboard?: {
      title: string;
      subtitle: string;
    };
    bookingDetail?: {
      title: string;
      description: string;
    };
    notFound?: {
      title: string;
      description: string;
    };
    home?: {
      title: string;
      description: string;
      hero: {
        title: string;
        subtitle: string;
        cta: string;
      };
    };
    status?: {
      title: string;
      subtitle: string;
      categories: {
        coreInfrastructure: string;
        customerPortal: string;
        hostPortal: string;
        integrations: string;
      };
      features: {
        i18nSystem: string;
        nextjsReact: string;
        responsiveNavigation: string;
        typescriptIntegration: string;
        tourBrowsing: string;
        bookingSystem: string;
        userDashboard: string;
        reviewSystem: string;
        bookingManagement: string;
        tourCreation: string;
        earningsDashboard: string;
        messagingSystem: string;
        stripeIntegration: string;
        databasePostgres: string;
        viatorApiIntegration: string;
        authenticationSystem: string;
      };
      descriptions: {
        i18nSystemDesc: string;
        nextjsReactDesc: string;
        responsiveNavigationDesc: string;
        typescriptIntegrationDesc: string;
        tourBrowsingDesc: string;
        bookingSystemDesc: string;
        userDashboardDesc: string;
        reviewSystemDesc: string;
        bookingManagementDesc: string;
        tourCreationDesc: string;
        earningsDashboardDesc: string;
        messagingSystemDesc: string;
        stripeIntegrationDesc: string;
        databasePostgresDesc: string;
        viatorApiIntegrationDesc: string;
        authenticationSystemDesc: string;
      };
      status: {
        implemented: string;
        inProgress: string;
        planned: string;
      };
      techStack: string;
      techStackItems: {
        nextjs: {
          title: string;
          subtitle: string;
        };
        tailwind: {
          title: string;
          subtitle: string;
        };
        typescript: {
          title: string;
          subtitle: string;
        };
        i18n: {
          title: string;
          subtitle: string;
        };
      };
      portfolioContext: string;
      portfolioDescription: string;
      portfolioPoints: {
        modernReact: string;
        i18nExpertise: string;
        marketplaceArchitecture: string;
        contemporaryStyling: string;
        professionalStructure: string;
      };
      portfolioFooter: string;
    };
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
  };
  tours?: {
    searchPlaceholder: string;
    result: string;
    results: string;
    filters: string;
    filteredBy: string; // ✅ ADDED - Nova propriedade para resolver erro
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
      [key: string]: string; // ✅ Index signature para acesso dinâmico
    };
    sort?: {
      newest: string;
      popular: string;
      priceAsc: string;
      priceDesc: string;
      rating: string;
      duration: string;
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
      art: string; // ✅ ADDED - Nova categoria
      nightlife: string; // ✅ ADDED - Nova categoria
      [key: string]: string; // ✅ Index signature para acesso dinâmico
    };
    hostCta?: {
      title: string;
      description: string;
      button: string;
    };
  };
  errors?: {
    generic: string;
    network: string;
    notFound: string;
    unauthorized: string;
    validation: string;
  };
}

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

export type BookingFormProps = {
  tourId: string;
  tour?: Tour;
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
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
