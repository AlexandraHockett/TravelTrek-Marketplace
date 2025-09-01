// File: app/api/stripe/checkout/route.ts
// Location: Create this file in app/api/stripe/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// In a real app, you would install and import Stripe:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Mock Stripe response for development
interface MockStripeSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email?: string;
  metadata: Record<string, string>;
}

// POST - Create a checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.amount || typeof body.amount !== "number") {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (body.amount < 50) {
      // Minimum €0.50
      return NextResponse.json(
        { error: "Amount must be at least €0.50" },
        { status: 400 }
      );
    }

    const {
      amount, // Amount in cents
      currency = "eur",
      bookingId,
      tourId,
      participants,
      date,
      successUrl,
      cancelUrl,
    } = body;

    // Get origin for URLs
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    // Default URLs if not provided
    const defaultSuccessUrl =
      successUrl || `${origin}/customer/bookings?payment=success`;
    const defaultCancelUrl =
      cancelUrl || `${origin}/customer/bookings?payment=cancelled`;

    // In a real app, this would create a Stripe session:
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `TravelTrek Tour ${tourId ? `- Tour #${tourId}` : ''}`,
              description: bookingId ? `Booking #${bookingId}` : 'Tour booking payment',
            },
            unit_amount: Math.round(amount / (participants || 1)),
          },
          quantity: participants || 1,
        },
      ],
      success_url: `${defaultSuccessUrl}${bookingId ? `&booking=${bookingId}` : ''}`,
      cancel_url: `${defaultCancelUrl}${bookingId ? `&booking=${bookingId}` : ''}`,
      metadata: {
        bookingId: bookingId || '',
        tourId: tourId || '',
        participants: String(participants || 1),
        date: date || '',
      },
      customer_email: body.customerEmail || undefined,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
    */

    // Mock response for development
    const mockSession: MockStripeSession = {
      id: `cs_test_${Date.now()}`,
      url: `${origin}/mock-stripe-checkout?session_id=cs_test_${Date.now()}&amount=${amount}&currency=${currency}`,
      payment_status: "unpaid",
      amount_total: amount,
      currency,
      customer_email: body.customerEmail,
      metadata: {
        bookingId: bookingId || "",
        tourId: tourId || "",
        participants: String(participants || 1),
        date: date || "",
      },
    };

    // In development, we can simulate immediate payment success
    if (process.env.NODE_ENV === "development") {
      // Simulate updating booking status if bookingId provided
      if (bookingId) {
        console.log(
          `[MOCK STRIPE] Would update booking ${bookingId} to confirmed/paid`
        );
      }

      // Return success URL directly for testing
      return NextResponse.json({
        sessionId: mockSession.id,
        url: `${defaultSuccessUrl}${bookingId ? `&booking=${bookingId}` : ""}&session_id=${mockSession.id}&amount=${amount / 100}`,
        mock: true,
        message: "Mock payment session created - redirecting to success page",
      });
    }

    return NextResponse.json({
      sessionId: mockSession.id,
      url: mockSession.url,
      mock: true,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// GET - Retrieve checkout session (for verification)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // In a real app:
    /*
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      metadata: session.metadata,
    });
    */

    // Mock response
    const mockSession = {
      id: sessionId,
      payment_status: sessionId.includes("success") ? "paid" : "unpaid",
      amount_total: 5000, // €50.00 in cents
      currency: "eur",
      customer_email: "customer@example.com",
      metadata: {
        bookingId: "booking-1",
        tourId: "1",
      },
    };

    return NextResponse.json(mockSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve checkout session" },
      { status: 500 }
    );
  }
}
