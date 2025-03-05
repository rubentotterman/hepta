import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getCustomerInvoices } from "@/lib/stripe"

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check for test session in headers
    const authHeader = req.headers.get("authorization")
    const isTestSession = authHeader && authHeader.startsWith("Bearer test_")

    console.log(
      "Get invoices API called. Auth header:",
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
      console.log("Using test user for fetching invoices")

      // For test sessions, return some mock invoices
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

    if (!session && !isTestSession) {
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
    return NextResponse.json(
      {
        error: `Failed to fetch invoices: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

