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
  language: string;
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
    home?: string;
    tours?: string;
    bookings?: string;
    profile?: string;
    host?: string;
    login?: string;
    signup?: string;
    exploreTours?: string;
    myBookings?: string;
    hostPortal?: string;
    dashboard?: string;
    earnings?: string;
    messages?: string;
    settings?: string;
    logout?: string;
    help?: string;
    contact?: string;
    about?: string;
    terms?: string;
    privacy?: string;
  };
  common?: {
    viewAll?: string;
    reviews?: string;
    review?: string;
    welcome?: string;
    person?: string;
    persons?: string;
    hours?: string;
    hour?: string;
    from?: string;
    to?: string;
    loading?: string;
    error?: string;
    success?: string;
    cancel?: string;
    confirm?: string;
    processing?: string;
    total?: string;
    back?: string;
    next?: string;
    previous?: string;
    and?: string;
    optional?: string;
    save?: string;
    edit?: string;
    delete?: string;
    view?: string;
    close?: string;
    search?: string;
    filter?: string;
    sort?: string;
    date?: string;
    time?: string;
    price?: string;
    currency?: string;
    yes?: string;
    no?: string;
  };
  bookingForm?: {
    selectDate?: string;
    invalidParticipants?: string;
    paymentError?: string;
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
  };
  auth?: {
    pleaseLogin?: string;
  };
  api?: {
    errors?: {
      tourNotFound?: string;
      bookingNotFound?: string;
      invalidData?: string;
      maxParticipantsExceeded?: string;
      bookingNotCancellable?: string;
      paymentFailed?: string;
      serverError?: string;
      unauthorised?: string;
      validationFailed?: string;
    };
  };
  tourDetails?: {
    // ✅ ADICIONADO COMPLETO
    difficulty: {
      easy: string;
      moderate: string;
      challenging: string;
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
    viewDetails?: string;
    host?: string;
    contactHost?: string;
    similarTours?: string;
    reviewsTitle?: string;
    writeReview?: string;
    rating?: string;
    submitReview?: string;
    reviewPlaceholder?: string;
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
      [key: string]: string; // Allow any string key
      label: string;
      easy: string;
      moderate: string;
      challenging: string;
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
      [key: string]: string;
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
    };
    hostCta?: {
      title: string;
      description: string;
      button: string;
    };
    tryDifferent?: string;
    duration?: string;
    rating?: string;
    applyFilters?: string;
    popularity?: string;
    priceLowHigh?: string;
    priceHighLow?: string;
    ratingHighLow?: string;
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
    tourDescription?: {};
    specialRequests?: {};
    meetingPointDetails?: {};
    cancellationPolicyDetails?: {};
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
      // ✅ ADICIONADO
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
      [key: string]: string | object;
    };
    status?: {
      [key: string]: string | object;
    };
  };
  footer?: {
    top?: {
      explore?: string;
      host?: string;
      support?: string;
      company?: string;
      popularDestinations?: string;
      allDestinations?: string;
      tourCategories?: string;
      becomeHost?: string;
      hostResources?: string;
      responsibleHosting?: string;
      helpCenter?: string;
      safetyInfo?: string;
      cancellationOptions?: string;
      aboutUs?: string;
      newsroom?: string;
      careers?: string;
      investors?: string;
      copyright?: string;
      rights?: string;
    };
    support?: {
      title?: string;
      links?: {
        help?: string;
        contact?: string;
        terms?: string;
        privacy?: string;
      };
    };
    brand?: {
      description?: string;
      copyright?: string;
      rights?: string;
    };
    bottom?: {
      privacy?: string;
      terms?: string;
      cookies?: string;
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
  };
  errors?: {
    generic: string;
    network: string;
    notFound: string;
    unauthorized: string;
    validation: string;
  };
  hero?: {
    title?: string;
    highlight?: string;
    subtitle?: string;
    exploreToursButton?: string;
    becomeHostButton?: string;
  };
  search?: {
    title?: string;
    destinationLabel?: string;
    destinationPlaceholder?: string;
    checkInLabel?: string;
    participantsLabel?: string;
    participantsOptions?: {
      one?: string;
      two?: string;
      three?: string;
      fourPlus?: string;
    };
    searchButton?: string;
  };
  benefits?: {
    title?: string;
    subtitle?: string;
    localExperiences?: { title?: string; description?: string };
    verifiedHosts?: { title?: string; description?: string };
    fairPrices?: { title?: string; description?: string };
    qualityGuaranteed?: { title?: string; description?: string };
  };
  hostCta?: {
    title?: string;
    subtitle?: string;
    startTodayButton?: string;
    learnEarningsButton?: string;
    startHosting?: string;
    learnMore?: string;
  };
  statistics?: {
    happyTravelers?: string;
    uniqueTours?: string;
    citiesWorldwide?: string;
  };
  navigation?: {
    home?: string;
    tours?: string;
    bookings?: string;
    profile?: string;
    login?: string;
    signup?: string;
    logout?: string;
    dashboard?: string;
    help?: string;
    contact?: string;
    about?: string;
    terms?: string;
    privacy?: string;
  };
}

// ✅ CORRIGIR BookingFormProps para aceitar tour
export type BookingFormProps = {
  tour: Tour;
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
  onBookingComplete?: (bookingData: any) => void;
  className?: string;
  variant?: "default" | "compact" | "minimal" | "sidebar";
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
