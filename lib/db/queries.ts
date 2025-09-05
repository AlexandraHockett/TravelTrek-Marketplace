// ===================================================================
// 📁 lib/db/queries.ts - VERSÃO CORRIGIDA COMPLETA
// Location: REPLACE the existing lib/db/queries.ts
// ===================================================================

import { desc, eq, and, gte, lte, sql, ilike, or, count } from "drizzle-orm";
import { db } from "./client";
import { tours, bookings, users } from "./schema";
import type {
  Tour,
  Booking,
  User,
  NewTour,
  NewBooking,
  NewUser,
} from "./client";

// ===================================================================
// TOURS QUERIES
// ===================================================================

export const tourQueries = {
  // Get all tours with filters and pagination
  async getAll(
    filters: {
      location?: string;
      maxPrice?: number;
      difficulty?: string;
      minRating?: number;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const conditions = [eq(tours.isActive, true)];

    if (filters.location) {
      conditions.push(ilike(tours.location, `%${filters.location}%`));
    }

    if (filters.maxPrice) {
      conditions.push(lte(tours.price, filters.maxPrice.toString()));
    }

    if (filters.difficulty) {
      conditions.push(eq(tours.difficulty, filters.difficulty as any));
    }

    if (filters.minRating) {
      conditions.push(gte(tours.rating, filters.minRating.toString()));
    }

    const results = await db
      .select()
      .from(tours)
      .where(and(...conditions))
      .orderBy(desc(tours.createdAt))
      .limit(filters.limit || 10)
      .offset(filters.offset || 0);

    const totalResult = await db
      .select({ count: sql`count(*)` })
      .from(tours)
      .where(and(...conditions));

    return {
      tours: results,
      total: Number(totalResult[0].count),
    };
  },

  // Get tour by ID
  async getById(id: string): Promise<Tour | null> {
    const result = await db
      .select()
      .from(tours)
      .where(and(eq(tours.id, id), eq(tours.isActive, true)))
      .limit(1);

    return result[0] || null;
  },

  // Create new tour
  async create(
    tourData: Omit<NewTour, "id" | "createdAt" | "updatedAt">
  ): Promise<Tour> {
    const [result] = await db
      .insert(tours)
      .values({
        ...tourData,
        updatedAt: new Date(),
      })
      .returning();

    return result;
  },

  // Update tour
  async update(
    id: string,
    updates: Partial<Omit<NewTour, "id">>
  ): Promise<Tour | null> {
    const [result] = await db
      .update(tours)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, id))
      .returning();

    return result || null;
  },

  // Soft delete tour
  async delete(id: string): Promise<boolean> {
    const [result] = await db
      .update(tours)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, id))
      .returning();

    return !!result;
  },

  // Get tours by host
  async getByHost(hostId: string) {
    return await db
      .select()
      .from(tours)
      .where(and(eq(tours.hostId, hostId), eq(tours.isActive, true)))
      .orderBy(desc(tours.createdAt));
  },
};

// ===================================================================
// BOOKINGS QUERIES
// ===================================================================

export const bookingQueries = {
  // Get all bookings with filters
  async getAll(
    filters: {
      customerId?: string;
      hostId?: string;
      tourId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const conditions = [];

    if (filters.customerId) {
      conditions.push(eq(bookings.customerId, filters.customerId));
    }

    if (filters.hostId) {
      conditions.push(eq(bookings.hostId, filters.hostId));
    }

    if (filters.tourId) {
      conditions.push(eq(bookings.tourId, filters.tourId));
    }

    if (filters.status) {
      conditions.push(eq(bookings.status, filters.status as any));
    }

    const results = await db
      .select({
        booking: bookings,
        tour: tours,
        customer: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .leftJoin(users, eq(bookings.customerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(bookings.createdAt))
      .limit(filters.limit || 10)
      .offset(filters.offset || 0);

    const totalResult = await db
      .select({ count: sql`count(*)` })
      .from(bookings)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      bookings: results,
      total: Number(totalResult[0].count),
    };
  },

  // Get booking by ID with tour and customer details
  async getById(id: string) {
    const result = await db
      .select({
        booking: bookings,
        tour: tours,
        customer: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .leftJoin(users, eq(bookings.customerId, users.id))
      .where(eq(bookings.id, id))
      .limit(1);

    return result[0] || null;
  },

  // Create new booking
  async create(
    bookingData: Omit<NewBooking, "id" | "createdAt" | "updatedAt">
  ): Promise<Booking> {
    const [result] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        updatedAt: new Date(),
      })
      .returning();

    return result;
  },

  // Update booking
  async update(
    id: string,
    updates: Partial<Omit<NewBooking, "id">>
  ): Promise<Booking | null> {
    const [result] = await db
      .update(bookings)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    return result || null;
  },

  // Delete booking
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();

    return result.length > 0;
  },

  // Get bookings by customer
  async getByCustomer(customerId: string, status?: string) {
    const conditions = [eq(bookings.customerId, customerId)];

    if (status) {
      conditions.push(eq(bookings.status, status as any));
    }

    return await db
      .select({
        booking: bookings,
        tour: {
          id: tours.id,
          title: tours.title,
          image: tours.image,
          location: tours.location,
          duration: tours.duration,
        },
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .where(and(...conditions))
      .orderBy(desc(bookings.createdAt));
  },

  // Get bookings by host
  async getByHost(hostId: string, status?: string) {
    const conditions = [eq(bookings.hostId, hostId)];

    if (status) {
      conditions.push(eq(bookings.status, status as any));
    }

    return await db
      .select({
        booking: bookings,
        tour: {
          id: tours.id,
          title: tours.title,
          image: tours.image,
        },
        customer: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.tourId, tours.id))
      .leftJoin(users, eq(bookings.customerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(bookings.createdAt));
  },
};

// ===================================================================
// USERS QUERIES - VERSÃO COMPLETA CORRIGIDA
// ===================================================================

export const userQueries = {
  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  },

  // Create new user
  async create(
    userData: Omit<NewUser, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const [result] = await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: new Date(),
      })
      .returning();

    return result;
  },

  // Update user
  async update(
    id: string,
    updates: Partial<Omit<NewUser, "id">>
  ): Promise<User | null> {
    const [result] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return result || null;
  },

  // Get all hosts
  async getHosts() {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "host"))
      .orderBy(users.name);
  },

  // Get all customers
  async getCustomers() {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "customer"))
      .orderBy(users.name);
  },

  // ===================================================================
  // NOVAS FUNÇÕES ADICIONADAS DENTRO DO userQueries
  // ===================================================================

  // Get all users with filters - NOVA FUNÇÃO CORRIGIDA
  async getAll(
    filters: {
      role?: "customer" | "host" | "admin";
      emailVerified?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ) {
    // ✅ Build conditions array
    const conditions = [];

    if (filters.role) {
      conditions.push(eq(users.role, filters.role));
    }

    if (filters.emailVerified !== undefined) {
      conditions.push(eq(users.emailVerified, filters.emailVerified));
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(users.name, `%${filters.search}%`),
          ilike(users.email, `%${filters.search}%`)
        )
      );
    }

    // ✅ FIXED: Proper query building
    let usersQuery = db.select().from(users);

    if (conditions.length > 0) {
      usersQuery = usersQuery.where(and(...conditions)) as any;
    }

    // Get paginated results
    const usersResult = await usersQuery
      .orderBy(desc(users.createdAt))
      .limit(filters.limit || 10)
      .offset(filters.offset || 0);

    // ✅ FIXED: Separate query for count
    let countQuery = db.select({ count: sql`count(*)` }).from(users);

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as any;
    }

    const totalResult = await countQuery;
    const total = Number(totalResult[0].count);

    return {
      users: usersResult,
      total,
    };
  },
  // Delete user
  async delete(id: string): Promise<User | null> {
    try {
      const [result] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      return result || null;
    } catch (error) {
      console.error("Error deleting user:", error);
      return null;
    }
  },

  // Get users with advanced statistics - NOVA FUNÇÃO CORRIGIDA
  async getUsersWithStats(
    filters: {
      role?: "customer" | "host" | "admin";
      limit?: number;
      offset?: number;
    } = {}
  ) {
    // Get users first using the getAll method
    const usersResult = await this.getAll(filters);

    // Add statistics for each user
    const usersWithStats = await Promise.all(
      usersResult.users.map(async (user) => {
        if (user.role === "host") {
          // Get host statistics
          const [bookingStats, tourStats] = await Promise.all([
            db
              .select({
                totalBookings: sql`count(${bookings.id})`,
                totalEarnings: sql`sum(${bookings.totalPrice})`,
              })
              .from(bookings)
              .where(eq(bookings.hostId, user.id)),

            db
              .select({
                totalTours: sql`count(${tours.id})`,
                averageRating: sql`avg(${tours.rating})`,
              })
              .from(tours)
              .where(and(eq(tours.hostId, user.id), eq(tours.isActive, true))),
          ]);

          return {
            ...user,
            stats: {
              totalBookings: Number(bookingStats[0]?.totalBookings || 0),
              totalEarnings: Number(bookingStats[0]?.totalEarnings || 0),
              totalTours: Number(tourStats[0]?.totalTours || 0),
              averageRating: Number(tourStats[0]?.averageRating || 0),
            },
          };
        } else if (user.role === "customer") {
          // Get customer statistics
          const bookingStats = await db
            .select({
              totalBookings: sql`count(${bookings.id})`,
              totalSpent: sql`sum(${bookings.totalPrice})`,
            })
            .from(bookings)
            .where(eq(bookings.customerId, user.id));

          return {
            ...user,
            stats: {
              totalBookings: Number(bookingStats[0]?.totalBookings || 0),
              totalSpent: Number(bookingStats[0]?.totalSpent || 0),
            },
          };
        }

        return user;
      })
    );

    return {
      users: usersWithStats,
      total: usersResult.total,
    };
  },
};

// ===================================================================
// STATISTICS QUERIES (for dashboard)
// ===================================================================

export const statsQueries = {
  // Get general stats
  async getGeneralStats() {
    const [toursCount] = await db
      .select({ count: sql`count(*)` })
      .from(tours)
      .where(eq(tours.isActive, true));

    const [bookingsCount] = await db
      .select({ count: sql`count(*)` })
      .from(bookings);

    const [usersCount] = await db.select({ count: sql`count(*)` }).from(users);

    const [hostsCount] = await db
      .select({ count: sql`count(*)` })
      .from(users)
      .where(eq(users.role, "host"));

    return {
      tours: Number(toursCount.count),
      bookings: Number(bookingsCount.count),
      users: Number(usersCount.count),
      hosts: Number(hostsCount.count),
    };
  },

  // Get host earnings
  async getHostEarnings(hostId: string, startDate?: string, endDate?: string) {
    const conditions = [
      eq(bookings.hostId, hostId),
      eq(bookings.paymentStatus, "paid"),
    ];

    if (startDate) {
      conditions.push(gte(bookings.date, startDate));
    }

    if (endDate) {
      conditions.push(lte(bookings.date, endDate));
    }

    const result = await db
      .select({
        totalEarnings: sql`sum(${bookings.totalPrice})`,
        totalBookings: sql`count(*)`,
      })
      .from(bookings)
      .where(and(...conditions));

    return {
      totalEarnings: Number(result[0]?.totalEarnings || 0),
      totalBookings: Number(result[0]?.totalBookings || 0),
    };
  },
};
