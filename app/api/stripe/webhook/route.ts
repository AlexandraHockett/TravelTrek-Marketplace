// File: app/api/stripe/webhook/route.ts
// Location: Create this file in app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// In a real app, you would use Stripe:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_status?: string;
      amount_total?: number;
      currency?: string;
      metadata?: Record<string, string>;
      customer_details?: {
        email?: string;
      };
    };
  };
}

// Simulate updating a booking after payment
async function updateBookingAfterPayment(bookingId: string, sessionData: any) {
  try {
    // In a real app, this would update your database
    console.log(
      `[WEBHOOK] Updating booking ${bookingId} after successful payment:`,
      {
        sessionId: sessionData.id,
        amount: sessionData.amount_total,
        currency: sessionData.currency,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
      }
    );

    // Mock API call to update booking
    const mockUpdateResult = {
      bookingId,
      status: "confirmed",
      paymentStatus: "paid",
      updatedAt: new Date().toISOString(),
    };

    return mockUpdateResult;
  } catch (error: any) {
    // Typed as any to handle unknown
    console.error("Error updating booking:", error);
    throw error;
  }
}

// Send confirmation emails (mock)
async function sendConfirmationEmail(bookingData: any, sessionData: any) {
  try {
    console.log(`[WEBHOOK] Sending confirmation email:`, {
      to: sessionData.customer_details?.email,
      bookingId: bookingData.bookingId,
      tourId: sessionData.metadata?.tourId,
      amount: sessionData.amount_total / 100,
      currency: sessionData.currency,
    });

    // In a real app, you would use an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Mailgun

    return { sent: true, email: sessionData.customer_details?.email };
  } catch (error: any) {
    // Typed as any to handle unknown
    console.error("Error sending confirmation email:", error);
    return { sent: false, error: error.message };
  }
}

// POST - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: WebhookEvent;

    // In a real app, verify the webhook signature:
    /*
    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    */

    // For development/testing, parse the mock event
    try {
      event = JSON.parse(body) as WebhookEvent;
    } catch (parseError: any) {
      // Typed as any to handle unknown
      // If it's not JSON, create a mock event for testing
      event = {
        id: `evt_${Date.now()}`,
        type: "checkout.session.completed",
        data: {
          object: {
            id: `cs_test_${Date.now()}`,
            payment_status: "paid",
            amount_total: 5000,
            currency: "eur",
            metadata: {
              bookingId: "booking-1",
              tourId: "1",
              participants: "2",
            },
            customer_details: {
              email: "customer@example.com",
            },
          },
        },
      };
    }

    console.log(`[WEBHOOK] Received event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(`[WEBHOOK] Payment succeeded for session: ${session.id}`);

        if (session.payment_status === "paid") {
          const bookingId = session.metadata?.bookingId;

          if (bookingId) {
            try {
              // Update booking status
              const updatedBooking = await updateBookingAfterPayment(
                bookingId,
                session
              );

              // Send confirmation emails
              const emailResult = await sendConfirmationEmail(
                updatedBooking,
                session
              );

              console.log(
                `[WEBHOOK] Successfully processed payment for booking ${bookingId}`
              );

              return NextResponse.json({
                received: true,
                processed: true,
                bookingId,
                emailSent: emailResult.sent,
              });
            } catch (error: any) {
              // Typed as any to handle unknown
              console.error(
                `[WEBHOOK] Error processing payment for booking ${bookingId}:`,
                error
              );
              return NextResponse.json(
                { received: true, processed: false, error: error.message },
                { status: 500 }
              );
            }
          } else {
            console.log("[WEBHOOK] No booking ID in session metadata");
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        console.log(`[WEBHOOK] Payment session expired: ${session.id}`);

        const bookingId = session.metadata?.bookingId;
        if (bookingId) {
          console.log(
            `[WEBHOOK] Should handle expired session for booking ${bookingId}`
          );
          // In a real app, you might want to:
          // - Send an email about the expired session
          // - Update booking status to indicate payment failed
          // - Free up the reserved spot
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log(`[WEBHOOK] Payment failed: ${paymentIntent.id}`);

        // Handle failed payments
        // - Update booking status
        // - Send notification to customer
        // - Log for analytics
        break;
      }

      case "invoice.payment_succeeded": {
        // Handle subscription payments if you add recurring billing
        console.log("[WEBHOOK] Invoice payment succeeded");
        break;
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellations
        console.log("[WEBHOOK] Subscription cancelled");
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    // Typed as any to handle unknown
    console.error("[WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// GET - For webhook endpoint verification (some providers require this)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");

  if (challenge) {
    // Echo back the challenge for webhook verification
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    message: "Stripe webhook endpoint is active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
