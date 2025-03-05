import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createTestInvoice } from "@/lib/stripe"

export async function POST(req: Request) {
  // Only allow this in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the authorization header for test sessions
    const authHeader = req.headers.get("authorization")
    const isTestSession = authHeader && authHeader.startsWith("Bearer test_")

    console.log(
      "Create test invoice API called. Auth header:",
      authHeader ? "Present" : "Missing",
      "Test session:",
      isTestSession ? "Yes" : "No",
    )

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session && !isTestSession) {
      console.log("No valid session found for test invoice creation")
      return NextResponse.json({ error: "Unauthorized - No valid session found" }, { status: 401 })
    }

    // For test sessions, return a mock invoice
    if (isTestSession) {
      console.log("Creating mock test invoice for test session")

      // Return a mock invoice
      return NextResponse.json({
        invoice: {
          id: "in_test_" + Math.random().toString(36).substring(2, 10),
          number: "TEST" + Math.floor(Math.random() * 10000),
          amount_due: Math.floor(Math.random() * 100000), // Random amount in cents
          currency: "nok",
          status: "open",
          due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
          created: Math.floor(Date.now() / 1000),
        },
      })
    }

    // Use test user ID for test sessions
    const userId = isTestSession ? "test-user-id" : session?.user.id

    if (!userId) {
      return NextResponse.json({ error: "No user ID available" }, { status: 400 })
    }

    console.log(`Creating test invoice for user: ${userId}`)

    // Get the user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)

      // If the profile doesn't exist, create it
      if (profileError.code === "PGRST116") {
        console.log("Profile not found, creating customer directly")

        // Create a customer directly through the API
        const customerResponse = await fetch(new URL("/api/stripe/create-customer", req.url).toString(), {
          method: "POST",
          headers: {
            Authorization: authHeader || "",
            Cookie: req.headers.get("cookie") || "",
          },
        })

        if (!customerResponse.ok) {
          const errorText = await customerResponse.text()
          console.error("Failed to create customer:", errorText)
          return NextResponse.json({ error: `Failed to create customer: ${errorText}` }, { status: 500 })
        }

        const { customerId } = await customerResponse.json()

        if (!customerId) {
          return NextResponse.json({ error: "No customer ID returned" }, { status: 500 })
        }

        console.log(`Created new customer with ID: ${customerId}`)

        // Create a test invoice with the new customer ID
        const invoice = await createTestInvoice(customerId)

        // Save the invoice to the database
        const { data: invoiceData, error: invoiceError } = await supabase.from("invoices").insert({
          user_id: userId,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_due / 100, // Convert from øre to NOK
          currency: invoice.currency,
          description: "Test Invoice - Development Only",
          status: invoice.status,
          due_date: new Date(invoice.due_date * 1000).toISOString(),
          created_at: new Date().toISOString(),
        })

        if (invoiceError) {
          console.error("Error saving invoice to database:", invoiceError)
          return NextResponse.json({ error: `Failed to save invoice: ${invoiceError.message}` }, { status: 500 })
        }

        return NextResponse.json({ invoice })
      }

      return NextResponse.json({ error: `Profile error: ${profileError.message}` }, { status: 500 })
    }

    if (!profile?.stripe_customer_id) {
      console.log("No Stripe customer ID found, creating one")

      // Create a customer
      const customerResponse = await fetch(new URL("/api/stripe/create-customer", req.url).toString(), {
        method: "POST",
        headers: {
          Authorization: authHeader || "",
          Cookie: req.headers.get("cookie") || "",
        },
      })

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text()
        console.error("Failed to create customer:", errorText)
        return NextResponse.json({ error: `Failed to create customer: ${errorText}` }, { status: 500 })
      }

      const { customerId } = await customerResponse.json()

      if (!customerId) {
        return NextResponse.json({ error: "No customer ID returned" }, { status: 500 })
      }

      console.log(`Created new customer with ID: ${customerId}`)

      // Create a test invoice with the new customer ID
      const invoice = await createTestInvoice(customerId)

      // Save the invoice to the database
      const { data: invoiceData, error: invoiceError } = await supabase.from("invoices").insert({
        user_id: userId,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_due / 100, // Convert from øre to NOK
        currency: invoice.currency,
        description: "Test Invoice - Development Only",
        status: invoice.status,
        due_date: new Date(invoice.due_date * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })

      if (invoiceError) {
        console.error("Error saving invoice to database:", invoiceError)
        return NextResponse.json({ error: `Failed to save invoice: ${invoiceError.message}` }, { status: 500 })
      }

      return NextResponse.json({ invoice })
    } else {
      console.log(`Using existing customer ID: ${profile.stripe_customer_id}`)

      // Create a test invoice with the existing customer ID
      const invoice = await createTestInvoice(profile.stripe_customer_id)

      // Save the invoice to the database
      const { data: invoiceData, error: invoiceError } = await supabase.from("invoices").insert({
        user_id: userId,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_due / 100, // Convert from øre to NOK
        currency: invoice.currency,
        description: "Test Invoice - Development Only",
        status: invoice.status,
        due_date: new Date(invoice.due_date * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })

      if (invoiceError) {
        console.error("Error saving invoice to database:", invoiceError)
        return NextResponse.json({ error: `Failed to save invoice: ${invoiceError.message}` }, { status: 500 })
      }

      return NextResponse.json({ invoice })
    }
  } catch (error) {
    console.error("Error creating test invoice:", error)
    return NextResponse.json(
      {
        error: `Failed to create test invoice: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

