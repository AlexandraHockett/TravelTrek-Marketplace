import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Load environment variables
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found. Checking .env.local...');
  console.error('Current working directory:', process.cwd());
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client - NEON ALWAYS REQUIRES SSL
const client = postgres(connectionString, {
  ssl: 'require', // Always use SSL for Neon
});

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Type exports
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Tour = typeof schema.tours.$inferSelect;
export type NewTour = typeof schema.tours.$inferInsert;
export type Booking = typeof schema.bookings.$inferSelect;
export type NewBooking = typeof schema.bookings.$inferInsert;
