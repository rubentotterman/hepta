// api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
// REMOVED: import { headers } from "next/headers"; // We will get headers directly from req.headers
import { stripe } from "@/lib/stripe"; // Your Stripe lib initialization
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"; // Keep for Supabase
import type Stripe from 'stripe'; // Import Stripe types

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // We will get this inside the function

console.log("🪝 /api/stripe/webhook/route.ts file TOP LEVEL LOG"); // Check if file is loaded

export async function POST(req: Request) {
  console.log("🪝 POST /api/stripe/webhook ROUTE HANDLER INVOKED");
  console.log("Method:", req.method);

  // Log all incoming headers
  const headerEntries = [];
  for (const pair of req.headers.entries()) {
    headerEntries.push([pair[0], pair[1]]);
  }
  console.log("Incoming Headers:", JSON.stringify(Object.fromEntries(headerEntries), null, 2));

  const body = await req.text();
  const signature = req.headers.get("stripe-signature"); // Get signature directly from req.headers

  console.log("📄 Raw Body received (first 500 chars):", body.substring(0, 500));
  console.log("🔑 Signature Header value received:", signature); // Will be null if not present

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log("🤫 Webhook Secret used from env:", webhookSecret); // Check if it's loaded correctly

  let event: Stripe.Event;

  // 1. Validate prerequisites for signature verification
  if (!signature) {
    console.error("❌ CRITICAL: Stripe-Signature header is missing or null in req.headers!");
    return NextResponse.json({ error: "Stripe-Signature header missing" }, { status: 400 });
  }
  if (!webhookSecret) {
    console.error("❌ CRITICAL: STRIPE_WEBHOOK_SECRET is not set in environment!");
    // This is a server configuration issue.
    return NextResponse.json({ error: "Webhook secret not configured on server" }, { status: 500 });
  }
  if (!body) {
    // This case is unlikely if req.text() succeeds but good to have
    console.error("❌ CRITICAL: Request body is empty after req.text()!");
    return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
  }
  if (!stripe) {
    console.error("❌ CRITICAL: Stripe instance from '@/lib/stripe' is not initialized!");
    return NextResponse.json({ error: "Stripe service unavailable" }, { status: 500 });
  }

  // 2. Attempt to construct the event (verify signature)
  try {
    console.log("Attempting stripe.webhooks.constructEvent...");
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Stripe Webhook Event Verified:', event.type, `ID: ${event.id}`);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`, {
      errorName: err.name, // e.g., StripeSignatureVerificationError
      errorMessage: err.message,
      // Consider logging err.stack in dev only if it helps, might be too verbose or sensitive
    });
    // The error from constructEvent often includes hints, e.g. "No signatures found matching..."
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 3. Log the received event type (already done above after successful verification)

  const supabase = createRouteHandlerClient({ cookies }); // Assuming cookies() works here as intended

  // 4. Handle the event
  console.log(`🔄 Processing event type: ${event.type}`);
  try {
    switch (event.type) {
      case "invoice.paid":
        const invoicePaid = event.data.object as Stripe.Invoice;
        console.log(`  Processing invoice.paid for invoice ID: ${invoicePaid.id}, Customer: ${invoicePaid.customer}`);
        const { error: paidError } = await supabase
            .from("invoices")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("stripe_invoice_id", invoicePaid.id);

        if (paidError) {
          console.error(`  ❌ Supabase error updating invoice ${invoicePaid.id} to paid:`, paidError);
        } else {
          console.log(`  ✅ Supabase: Invoice ${invoicePaid.id} marked as paid.`);
        }
        break;

      case "invoice.payment_failed":
        const invoiceFailed = event.data.object as Stripe.Invoice;
        console.log(`  Processing invoice.payment_failed for invoice ID: ${invoiceFailed.id}, Customer: ${invoiceFailed.customer}`);
        const { error: failedError } = await supabase
            .from("invoices")
            .update({ status: "payment_failed" })
            .eq("stripe_invoice_id", invoiceFailed.id);

        if (failedError) {
          console.error(`  ❌ Supabase error updating invoice ${invoiceFailed.id} to payment_failed:`, failedError);
        } else {
          console.log(`  ✅ Supabase: Invoice ${invoiceFailed.id} marked as payment_failed.`);
        }
        break;

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`  Processing customer.subscription.created for subscription ID: ${subscription.id}, Customer: ${subscription.customer}`);
        // Add your logic here
        break;

      default:
        console.log(`  🤷‍♀️ Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error(`❌ Error during event handling for ${event.id} (type: ${event.type}): ${error.message}`, error);
  }

  // 5. Acknowledge receipt to Stripe
  console.log(`👍 Event ${event.id} processed. Responding 200 to Stripe.`);
  return NextResponse.json({ received: true });
}