import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createCustomer } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check for test session in headers
    const authHeader = req.headers.get("authorization")
    const isTestSession = authHeader && authHeader.startsWith("Bearer test_")

    console.log(
      `Create customer API called. Auth header:`,
      authHeader ? "Present" : "Missing",
      "Test session:",
      isTestSession ? "Yes" : "No",
    )

    // Get the current user from Supabase if not a test session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no real session but we have a test session header, use test user
    if (!session && isTestSession) {
      console.log("Using test user for customer creation")

      // For test sessions, return a mock customer ID
      return NextResponse.json({ customerId: "cus_test_123456789" })
    }

    if (!session && !isTestSession) {
      console.log("No valid session found for customer creation")
      return NextResponse.json({ error: "Unauthorized - No valid session found" }, { status: 401 })
    }

    const user = session?.user

    // Check if the user already has a Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user?.id || "test-user-id")
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError)
      throw profileError
    }

    // If the user already has a Stripe customer ID, return it
    if (profile?.stripe_customer_id) {
      console.log(`User already has customer ID: ${profile.stripe_customer_id}`)
      return NextResponse.json({ customerId: profile.stripe_customer_id })
    }

    // Create a new Stripe customer
    const customer = await createCustomer(
      user?.email || "test@example.com",
      user?.user_metadata?.full_name || "Test User",
    )

    console.log(`Created new customer with ID: ${customer.id}`)

    // Save the Stripe customer ID to the user's profile
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user?.id || "test-user-id",
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString(),
    })

    if (updateError) {
      console.error("Error saving customer ID to profile:", updateError)
      throw updateError
    }

    return NextResponse.json({ customerId: customer.id })
  } catch (error) {
    console.error("Error creating Stripe customer:", error)
    return NextResponse.json(
      {
        error: `Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

