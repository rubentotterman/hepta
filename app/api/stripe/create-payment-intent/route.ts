// app/api/stripe/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createPaymentIntent as libCreatePaymentIntent } from "@/lib/stripe"; // Omdøpt import for klarhet
// Anta at getOrCreateCustomerId er definert et sted, f.eks. i lib/stripe-helpers.ts
// Hvis ikke, må du implementere denne eller fjerne den og sende customerId fra klienten om nødvendig.
// For dette eksempelet antar vi at du vil opprette/hente kunde her.
import { stripe } from "@/lib/stripe"; // For å lage/hente kunde direkte her

// Hjelpefunksjon for å hente eller opprette Stripe kunde-ID
// Du kan flytte denne til lib/stripe-helpers.ts eller beholde den her hvis den kun brukes her.
async function getOrCreateStripeCustomerId(supabaseUserId: string, email?: string, name?: string): Promise<string | null> {
  console.log("--- DEBUG API Route: getOrCreateStripeCustomerId ---");
  console.log(`Fetching/Creating Stripe customer for Supabase User ID: ${supabaseUserId}, Email: ${email}`);

  const supabase = createRouteHandlerClient({ cookies });

  // 1. Sjekk om profilen har en stripe_customer_id
  const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", supabaseUserId) // Anta at 'user_id' er UUID-kolonnen som linker til auth.users
      .single();

  if (profileError && profileError.code !== "PGRST116") { // PGRST116 = no rows found
    console.error("API Route: Error fetching profile in getOrCreateStripeCustomerId:", profileError);
    throw new Error(`Failed to fetch profile: ${profileError.message}`); // Kast feilen så den fanges av ytre try-catch
  }

  if (profile?.stripe_customer_id) {
    console.log("API Route: Found existing Stripe Customer ID in profile:", profile.stripe_customer_id);
    return profile.stripe_customer_id;
  }

  // 2. Hvis ikke, opprett ny Stripe-kunde (bruker createCustomer fra lib/stripe)
  console.log("API Route: No Stripe Customer ID in profile, creating new Stripe customer.");
  if (!email) {
    console.error("API Route: Email is required to create a new Stripe customer.");
    throw new Error("Email is required to create a new Stripe customer if one doesn't exist.");
  }

  // Kall din createCustomer fra lib/stripe.ts
  // Sørg for at createCustomer i lib/stripe.ts returnerer et gyldig kundeobjekt eller håndterer feil
  const newStripeCustomer = await stripe.customers.create({ // Bruker stripe.customers.create direkte her for enkelhet, eller din egen createCustomer
    email,
    name,
    metadata: { supabaseUUID: supabaseUserId }
  });

  if (!newStripeCustomer || !newStripeCustomer.id ) { // Stripe.Customer har ikke en 'error' property direkte
    console.error("API Route: Failed to create Stripe customer via lib/stripe.ts or ID missing:", newStripeCustomer);
    throw new Error("Stripe customer creation failed or ID missing from Stripe response.");
  }
  console.log("API Route: New Stripe customer created. ID:", newStripeCustomer.id);

  // 3. Lagre den nye stripe_customer_id i profilen
  // Anta at profilen må eksistere for å kunne oppdatere, eller at vi lager den hvis den mangler.
  // Forutsetter at 'user_id' i 'profiles' har en UNIQUE constraint
  const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ user_id: supabaseUserId, stripe_customer_id: newStripeCustomer.id, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error("API Route: Error upserting profile with new Stripe Customer ID:", upsertError);
    throw new Error(`Failed to save Stripe Customer ID to profile: ${upsertError.message}`);
  }
  console.log("API Route: Profile upserted with new Stripe Customer ID:", newStripeCustomer.id);

  return newStripeCustomer.id;
}


export async function POST(req: Request) {
  console.log("\n--- DEBUG API Route: /api/stripe/create-payment-intent ---");
  try {
    const { amount, currency = "nok" } = await req.json();
    console.log("API Route: Request body parsed:", { amount, currency });

    if (typeof amount !== 'number' || amount <= 0) {
      console.warn("API Route: Invalid amount received:", amount);
      return NextResponse.json({ error: "Amount is required and must be a positive number" }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    console.log("API Route: Supabase client created.");

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("API Route: Error getting session:", sessionError);
      return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
    }
    if (!session) {
      console.warn("API Route: No active session. Unauthorized.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("API Route: Session retrieved. User ID:", session.user.id);

    const user = session.user;
    let customerId: string | null = null; // Endret til string | null

    try {
      console.log(`API Route: Attempting to get or create customer ID for Supabase user: ${user.id}`);
      customerId = await getOrCreateStripeCustomerId(user.id, user.email || undefined, user.user_metadata?.full_name || undefined);
      console.log(`API Route: Stripe Customer ID from getOrCreateStripeCustomerId: ${customerId}`);
      if (!customerId) {
        // getOrCreateStripeCustomerId kastet ikke feil, men returnerte null - dette er en feiltilstand
        throw new Error("getOrCreateStripeCustomerId returned null, indicating failure to obtain a customer ID.");
      }
    } catch (error: any) {
      console.error("API Route: Error from getOrCreateStripeCustomerId:", error);
      return NextResponse.json({ error: `Failed to get or create Stripe customer: ${error.message}` }, { status: 500 });
    }

    console.log(`API Route: Calling lib/stripe createPaymentIntent with amount: ${amount}, currency: ${currency}, customerId: ${customerId}`);
    const paymentIntentResponse = await libCreatePaymentIntent(amount, currency, customerId); // Kall til lib/stripe.ts

    console.log("API Route: PaymentIntent object received from lib/stripe:", JSON.stringify(paymentIntentResponse, null, 2));

    if (!paymentIntentResponse || paymentIntentResponse.error || !paymentIntentResponse.client_secret) {
      const piErrorMessage = paymentIntentResponse?.message || 'PaymentIntent or client_secret missing from lib/stripe response';
      console.error(`API Route: Error creating Payment Intent or client_secret missing. Message: ${piErrorMessage}`);
      return NextResponse.json({ error: `Failed to create payment intent: ${piErrorMessage}` }, { status: 500 });
    }

    console.log("API Route: Successfully created Payment Intent. Returning client_secret to frontend:", paymentIntentResponse.client_secret.substring(0,20) + "...");
    return NextResponse.json({
      clientSecret: paymentIntentResponse.client_secret,
    });

  } catch (error: any) {
    console.error("API Route: Unhandled error in create-payment-intent endpoint:", error);
    const message = error.message || "Unknown server error";
    // Sjekk om det er en Supabase AuthError for mer spesifikk melding
    if (error.name === 'AuthApiError' || error.name === 'AuthRetryableFetchError') {
      return NextResponse.json({ error: `Authentication error: ${message}` }, { status: 401 });
    }
    return NextResponse.json({ error: `Failed to create payment intent: ${message}` }, { status: 500 });
  }
}