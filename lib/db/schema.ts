// ===================================================================
// 📁 lib/db/schema.ts - FIXED VERSION
// Location: REPLACE lib/db/schema.ts completely
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

// Users table - Add password field (this is the only change we need)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"), // ✅ NOVO CAMPO - nullable para OAuth users
  avatar: text("avatar"),
  role: text("role", { enum: ["customer", "host", "admin"] }).notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tours table (keep exactly as is in database)
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

// Bookings table - Keep EXACTLY as exists in database (old structure)
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tourId: uuid("tour_id")
    .references(() => tours.id)
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => users.id)
    .notNull(),
  hostId: uuid("host_id")
    .references(() => users.id)
    .notNull(),
  customerName: text("customer_name").notNull(), // ✅ Keep as in DB
  customerEmail: text("customer_email").notNull(), // ✅ Keep as in DB
  date: text("date").notNull(), // ✅ Keep as text, not timestamp
  time: text("time").notNull(), // ✅ Keep separate time field
  participants: integer("participants").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
  })
    .notNull()
    .default("pending"),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"],
  })
    .notNull()
    .default("pending"),
  paymentId: text("payment_id"), // ✅ Keep as paymentId not stripePaymentIntentId
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews table (keep as is - this was working)
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
