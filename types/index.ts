// File: types/index.ts
// Location: Make sure this file matches exactly with proper TypeScript types
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

// File: app/types.ts
export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  hostId: string;
  date: string;
  participants: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  specialRequests?: string;
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
  // ESTA É A PROPRIEDADE QUE ESTAVA EM FALTA - ADICIONAR PAGES
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
      };
      stats?: {
        totalBookings: string;
        upcoming: string;
        totalSpent: string;
      };
    };
    // Adicionar outras páginas conforme necessário
    customerTours?: {
      title: string;
      subtitle: string;
      // ... outros campos
    };
    hostDashboard?: {
      title: string;
      subtitle: string;
      // ... outros campos
    };
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
