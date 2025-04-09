import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createCustomer } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { userId, email, name } = await req.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and email are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check if the user already has a customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError)
      throw profileError
    }

    // If the user already has a customer ID, return it
    if (profile?.stripe_customer_id) {
      return NextResponse.json({ customerId: profile.stripe_customer_id })
    }

    // Create a new Stripe customer
    const customer = await createCustomer(email, name)

    // Save the customer ID to the user's profile
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: userId,
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
      { error: `Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

