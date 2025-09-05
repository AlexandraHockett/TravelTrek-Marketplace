// File: lib/db/index.ts
// Location: Create this file in lib/db/index.ts

import { Tour, Booking, User } from "@/types";

// Mock database utilities
// In a real app, this would connect to PostgreSQL using Drizzle or Prisma

// Environment variables for database connection (mock)
export const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME || "traveltrek",
  user: process.env.DATABASE_USER || "traveltrek_user",
  password: process.env.DATABASE_PASSWORD || "",
  ssl: process.env.NODE_ENV === "production",
};

// Mock database client
class MockDatabase {
  private tours: Tour[] = [];
  private bookings: Booking[] = [];
  private users: User[] = [];

  // Tours
  async getTours(
    filters: {
      location?: string;
      maxPrice?: number;
      difficulty?: string;
      minRating?: number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ tours: Tour[]; total: number }> {
    let filteredTours = [...this.tours];

    if (filters.location) {
      filteredTours = filteredTours.filter((tour) =>
        tour.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      filteredTours = filteredTours.filter(
        (tour) => tour.price <= filters.maxPrice!
      );
    }

    if (filters.difficulty) {
      filteredTours = filteredTours.filter(
        (tour) =>
          tour.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      );
    }

    if (filters.minRating) {
      filteredTours = filteredTours.filter(
        (tour) => tour.rating >= filters.minRating!
      );
    }

    const total = filteredTours.length;
    const { limit = 10, offset = 0 } = filters;
    const paginatedTours = filteredTours.slice(offset, offset + limit);

    return { tours: paginatedTours, total };
  }

  async getTourById(id: string): Promise<Tour | null> {
    return this.tours.find((tour) => tour.id === id) || null;
  }

  async createTour(
    tourData: Omit<Tour, "id" | "createdAt" | "updatedAt">
  ): Promise<Tour> {
    const tour: Tour = {
      ...tourData,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tours.push(tour);
    return tour;
  }

  async updateTour(id: string, updates: Partial<Tour>): Promise<Tour | null> {
    const index = this.tours.findIndex((tour) => tour.id === id);
    if (index === -1) return null;

    this.tours[index] = {
      ...this.tours[index],
      ...updates,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };

    return this.tours[index];
  }

  async deleteTour(id: string): Promise<boolean> {
    const index = this.tours.findIndex((tour) => tour.id === id);
    if (index === -1) return false;

    this.tours.splice(index, 1);
    return true;
  }

  // Bookings
  async getBookings(
    filters: {
      customerId?: string;
      hostId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ bookings: Booking[]; total: number }> {
    let filteredBookings = [...this.bookings];

    if (filters.customerId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.customerId === filters.customerId
      );
    }

    if (filters.hostId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.hostId === filters.hostId
      );
    }

    if (filters.status) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === filters.status
      );
    }

    // Sort by creation date (newest first)
    filteredBookings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filteredBookings.length;
    const { limit = 20, offset = 0 } = filters;
    const paginatedBookings = filteredBookings.slice(offset, offset + limit);

    return { bookings: paginatedBookings, total };
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.id === id) || null;
  }

  async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ): Promise<Booking> {
    const booking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.push(booking);
    return booking;
  }

  async updateBooking(
    id: string,
    updates: Partial<Booking>
  ): Promise<Booking | null> {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    this.bookings[index] = {
      ...this.bookings[index],
      ...updates,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };

    return this.bookings[index];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return false;

    this.bookings.splice(index, 1);
    return true;
  }

  // Users
  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      id, // Keep original ID
    };

    return this.users[index];
  }

  // Utility methods
  async getBookingStats(customerId?: string, hostId?: string) {
    const bookings = this.bookings.filter((booking) => {
      if (customerId) return booking.customerId === customerId;
      if (hostId) return booking.hostId === hostId;
      return true;
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const completedBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    const totalSpent = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const upcomingBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.date);
      const now = new Date();
      return (
        bookingDate > now &&
        (b.status === "confirmed" || b.status === "pending")
      );
    }).length;

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalSpent,
      upcomingBookings,
    };
  }

  // Initialize with seed data
  async seed() {
    // Add some initial tours
    await this.createTour({
      title: "Historic Porto Walking Tour",
      description:
        "Discover the beautiful historic center of Porto with a local guide. Visit the most iconic landmarks and learn about the rich history of this UNESCO World Heritage city.",
      shortDescription: "Explore Porto's historic center with a local guide",
      image: "/images/tours/porto-food.webp",
      images: ["/images/tours/porto-food.webp"],
      price: 25,
      originalPrice: 35,
      currency: "EUR",
      duration: 3,
      location: "Porto, Portugal",
      rating: 4.8,
      reviewCount: 127,
      maxParticipants: 15,
      minimumAge: 8,
      difficulty: "Easy",
      included: ["Professional local guide", "Small group experience"],
      excluded: ["Food and drinks", "Transportation"],
      itinerary: [],
      cancellationPolicy:
        "Free cancellation up to 24 hours before the experience starts",
      hostId: "host-1",
      tags: ["history", "walking", "culture"],
      language: "en",
    });

    // Add initial users
    await this.createUser({
      name: "Maria Silva",
      email: "maria.silva@email.com",
      avatar: "/images/avatars/maria.jpg",
      role: "customer",
    });

    await this.createUser({
      name: "João Santos",
      email: "joao.santos@email.com",
      avatar: "/images/avatars/joao.jpg",
      role: "host",
    });

    console.log("Mock database seeded with initial data");
  }
}

// Singleton instance
export const db = new MockDatabase();

// Initialize database on first import (in development)
if (process.env.NODE_ENV === "development") {
  db.seed().catch(console.error);
}

// API response helpers
export const apiResponse = {
  success: <T>(data: T, message?: string) => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }),

  error: (error: string, code?: string, statusCode: number = 400) => ({
    success: false,
    error,
    code,
    timestamp: new Date().toISOString(),
    statusCode,
  }),

  paginated: <T>(data: T[], total: number, limit: number, offset: number) => ({
    success: true,
    data,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    },
    timestamp: new Date().toISOString(),
  }),
};

// Database connection helper (for real database integration)
export const connectToDatabase = async () => {
  // In a real app, this would establish PostgreSQL connection
  // using Drizzle, Prisma, or native pg client

  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required in production"
    );
  }

  console.log("Connected to mock database");
  return db;
};

export default db;
