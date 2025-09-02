// File: types/index.ts
// Location: REPLACE existing types/index.ts

export interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  duration: number;
  maxParticipants: number;
  rating: number;
  reviewCount: number;
  amenities?: string[];
  shortDescription?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
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
  // ✅ FIXED: Complete and properly ordered Booking interface

  // Core booking identifiers
  id: string;
  tourId: string;
  userId: string;

  // Tour details
  tourTitle: string;
  tourDescription?: string;
  tourImage: string;
  location: string;
  duration: number; // ✅ ADDED: Duration property that was missing

  // Customer information
  customerId?: string; // Made optional since it might be same as userId
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Host information
  hostId: string;
  hostName?: string;
  hostEmail?: string;
  hostPhone?: string;
  hostAvatar?: string;
  hostVerified?: boolean;
  hostResponseTime?: string;

  // Booking details
  date: string;
  time: string;
  participants: number;
  specialRequests?: string;
  meetingPoint?: string;
  cancellationPolicy?: string;

  // Pricing
  basePrice: number;
  serviceFees: number;
  totalAmount: number;
  totalPrice: number;
  currency: string;

  // Status tracking
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";

  // Timestamps
  createdAt: string;
  updatedAt: string;
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
    location?: string;
    bookNow?: string;
  };
  customer?: {
    dashboard?: {
      welcome?: string;
      subtitle?: string;
      stats?: {
        totalBookings?: string;
        upcomingTrips?: string;
        completedTrips?: string;
        totalSpent?: string;
      };
    };
  };
  host?: {
    dashboard?: string;
    welcome?: string;
    stats?: {
      totalBookings?: string;
      monthlyEarnings?: string;
      averageRating?: string;
      activeListings?: string;
    };
    earnings?: {
      thisMonth?: string;
      totalEarnings?: string;
      pendingPayouts?: string;
      completedPayouts?: string;
      chartTitle?: string;
    };
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
    instantConfirmation: string;
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
    bookingSuccess?: string;
    backToTours?: string;
    duration?: string;
    participants?: string;
    included?: string;
    excluded?: string;
    meetingPoint?: string;
    difficulty?: string;
    rating?: string;
    reviews?: string;
    bookNow?: string;
    from?: string;
    person?: string;
    persons?: string;
    cancellationPolicy?: string;
    location?: string;
  };
  bookingDetails?: {
    meetingPointDetails: string; // ✅ ADDED
    specialRequests: string; // ✅ ADDED
    tourDescription: string; // ✅ ADDED
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
    location: string;
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
    bookFirstTour: string;
    location: string;
  };
  pages?: {
    customerBookings?: {
      title: string;
      description: string;
      subtitle?: string; // ✅ ADDED
      browseTours?: string; // ✅ ADDED
      noBookingsDescription?: string; // ✅ ADDED
      stats?: {
        totalBookings?: string;
        upcoming?: string;
        totalSpent?: string;
      };
      filters?: {
        // ✅ ADDED: Complete filters section
        all?: string;
        bookingStatusLabel?: string;
        sortByLabel?: string;
      };
      sort?: {
        // ✅ ADDED: Complete sort section
        dateDesc?: string;
        dateAsc?: string;
        amountDesc?: string;
        amountAsc?: string;
      };
    };
    customerTours?: {
      title: string;
      description: string;
    };
    customerDashboard?: {
      title: string;
      description: string;
    };
  };
  footer?: {
    company?: {
      title: string;
      links?: {
        about: string;
        careers: string;
        press: string;
        blog: string;
      };
    };
    support?: {
      title: string;
      links?: {
        help: string;
        contact: string;
        trust: string;
        safety: string;
      };
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

// Component Props Types
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
  successUrl?: string;
  cancelUrl?: string;
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

export type TourCardProps = {
  tour: Tour;
  locale: string;
  translations: Translations;
  compact?: boolean;
  className?: string;
};

export type BookingFormProps = {
  tour: Tour;
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
  onBookingComplete?: (bookingData: any) => void;
  className?: string;
  variant?: "default" | "compact" | "minimal" | "sidebar";
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

export interface BasePageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface DetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}
