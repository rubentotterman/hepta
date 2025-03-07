import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getCustomerInvoices } from "@/lib/stripe"

export async function GET(req: Request) {
  try {
    // Remove the forced development mode
    // process.env.NODE_ENV = "development";

    const supabase = createRouteHandlerClient({ cookies })

    // Check for test session in headers
    const authHeader = req.headers.get("authorization")
    const isTestSession = authHeader && authHeader.startsWith("Bearer test_")

    console.log(
      "Get invoices API called. Auth header:",
      authHeader ? "Present" : "Missing",
      "Test session:",
      isTestSession ? "Yes" : "No",
      "NODE_ENV:",
      process.env.NODE_ENV,
    )

    // Get the current user from Supabase if not a test session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no real session but we have a test session header, use test user
    if (!session && isTestSession) {
      console.log("Using test user for fetching invoices")

      // For test sessions, we'll try to fetch real Stripe data
      // You'll need to set up a test customer ID in your profiles table
      const testCustomerId = "cus_your_test_customer_id" // Replace with your actual test customer ID from Stripe

      try {
        const invoices = await getCustomerInvoices(testCustomerId)
        return NextResponse.json({ invoices })
      } catch (stripeError) {
        console.error("Error fetching from Stripe:", stripeError)
        // Fall back to mock data if Stripe call fails
        return NextResponse.json({
          invoices: [
            {
              id: "in_test_1",
              number: "TEST001",
              amount_due: 10000, // 100.00 in cents
              currency: "nok",
              status: "open",
              due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
            },
            {
              id: "in_test_2",
              number: "TEST002",
              amount_due: 25000, // 250.00 in cents
              currency: "nok",
              status: "paid",
              due_date: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 days from now
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
            },
          ],
        })
      }
    }

    if (!session) {
      console.log("No valid session found for invoice fetch")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use test user ID for test sessions
    const userId = isTestSession ? "test-user-id" : session?.user.id

    if (!userId) {
      return NextResponse.json({ error: "No user ID available" }, { status: 400 })
    }

    // Get the user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)

      // If profile not found, return empty invoices
      if (profileError.code === "PGRST116") {
        return NextResponse.json({ invoices: [] })
      }

      throw profileError
    }

    if (!profile?.stripe_customer_id) {
      console.log("No Stripe customer ID found for user")
      return NextResponse.json({ invoices: [] })
    }

    // Get the invoices from Stripe
    const invoices = await getCustomerInvoices(profile.stripe_customer_id)
    console.log(`Found ${invoices.length} invoices for customer ${profile.stripe_customer_id}`)

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)

    // Detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    // Improved error handling to avoid [object Object] in the error message
    let errorMessage = "Failed to fetch invoices"
    if (error instanceof Error) {
      errorMessage += ": " + error.message
    } else if (typeof error === "string") {
      errorMessage += ": " + error
    } else {
      errorMessage += ": " + JSON.stringify(error)
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

