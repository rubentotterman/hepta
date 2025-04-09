import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createPaymentIntent } from "@/lib/stripe"
import { getOrCreateCustomerId } from "@/lib/stripe-helpers"

export async function POST(req: Request) {
  try {
    const { amount, currency = "nok" } = await req.json()

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user

    // Get or create the customer ID
    let customerId
    try {
      customerId = await getOrCreateCustomerId(user.id, user.email)
    } catch (error) {
      console.error("Error getting/creating customer ID:", error)
      return NextResponse.json({ error: "Failed to get or create customer" }, { status: 500 })
    }

    // Create the payment intent
    const paymentIntent = await createPaymentIntent(amount, currency, customerId)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

