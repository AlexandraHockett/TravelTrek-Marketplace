import { db } from "@/lib/db/client";
import { users, tours, bookings } from "@/lib/db/schema";

// Import mock data from your existing files
const mockUsers = [
  {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    avatar: "/images/avatars/maria.jpg",
    role: "customer",
  },
  {
    name: "João Santos",
    email: "joao.santos@email.com",
    avatar: "/images/avatars/joao.jpg",
    role: "customer",
  },
  {
    name: "Ana Costa",
    email: "ana.costa@email.com",
    avatar: "/images/avatars/ana.jpg",
    role: "host",
  },
  {
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    avatar: "/images/avatars/pedro.jpg",
    role: "host",
  },
];

const mockTours = [
  {
    title: "Porto Historic Walking Tour",
    description:
      "Discover the enchanting historic center of Porto with our expert local guide.",
    shortDescription: "Explore Porto's historic center with a local guide",
    image: "/images/tours/porto-historic.jpg",
    images: ["/images/tours/porto-historic.jpg"],
    price: "25.00",
    originalPrice: "35.00",
    currency: "EUR",
    duration: 3,
    location: "Porto, Portugal",
    rating: "4.8",
    reviewCount: 127,
    maxParticipants: 15,
    minimumAge: 8,
    difficulty: "Easy" as const,
    included: ["Professional local guide", "Small group experience"],
    excluded: ["Food and drinks", "Transportation"],
    itinerary: [],
    cancellationPolicy:
      "Free cancellation up to 24 hours before the experience starts",
    tags: ["history", "walking", "culture"],
    language: "en",
  },
  // Add more tours...
];

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(bookings);
    await db.delete(tours);
    await db.delete(users);

    console.log("📄 Cleared existing data");

    // Insert users
    const insertedUsers = await db
      .insert(users)
      .values(
        mockUsers.map((user) => ({
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as "customer" | "host" | "admin",
        }))
      )
      .returning();

    console.log(`👥 Inserted ${insertedUsers.length} users`);

    // Get host and customer IDs
    const hostUser = insertedUsers.find((u) => u.role === "host");
    const customerUser = insertedUsers.find((u) => u.role === "customer");

    if (!hostUser || !customerUser) {
      throw new Error("Host or customer user not found");
    }

    // Insert tours
    const insertedTours = await db
      .insert(tours)
      .values(
        mockTours.map((tour) => ({
          ...tour,
          hostId: hostUser.id,
        }))
      )
      .returning();

    console.log(`🗺️ Inserted ${insertedTours.length} tours`);

    // Insert sample booking
    await db.insert(bookings).values({
      tourId: insertedTours[0].id,
      customerId: customerUser.id,
      hostId: hostUser.id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      date: "2024-12-15",
      time: "14:00",
      participants: 2,
      totalPrice: "50.00",
      currency: "EUR",
      status: "confirmed",
      paymentStatus: "paid",
      paymentId: "pi_mock123",
      specialRequests: null,
    });

    console.log("📋 Inserted sample booking");
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
