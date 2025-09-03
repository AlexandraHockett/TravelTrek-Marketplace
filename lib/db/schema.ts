// ===================================================================
// 📁 lib/db/schema.ts
// Location: UPDATE existing lib/db/schema.ts
// ===================================================================

import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

// Users table - UPDATED with password field
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"), // ✅ NOVO CAMPO ADICIONADO (nullable para OAuth users)
  avatar: text("avatar"),
  role: text("role", { enum: ["customer", "host", "admin"] }).notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tours table (unchanged)
export const tours = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("EUR"),
  duration: integer("duration").notNull(),
  location: text("location").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  maxParticipants: integer("max_participants").notNull(),
  minimumAge: integer("minimum_age"),
  difficulty: text("difficulty", {
    enum: ["Easy", "Moderate", "Hard"],
  }).notNull(),
  included: jsonb("included").$type<string[]>().default([]),
  excluded: jsonb("excluded").$type<string[]>().default([]),
  itinerary: jsonb("itinerary")
    .$type<Array<{ time: string; activity: string }>>()
    .default([]),
  cancellationPolicy: text("cancellation_policy"),
  hostId: uuid("host_id")
    .references(() => users.id)
    .notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  language: text("language").notNull().default("en"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings table (unchanged)
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .references(() => users.id)
    .notNull(),
  hostId: uuid("host_id")
    .references(() => users.id)
    .notNull(),
  tourId: uuid("tour_id")
    .references(() => tours.id)
    .notNull(),
  tourDate: timestamp("tour_date").notNull(),
  participants: integer("participants").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
  })
    .notNull()
    .default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  customerNotes: text("customer_notes"),
  hostNotes: text("host_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews table (unchanged if exists)
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .references(() => bookings.id)
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => users.id)
    .notNull(),
  hostId: uuid("host_id")
    .references(() => users.id)
    .notNull(),
  tourId: uuid("tour_id")
    .references(() => tours.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
