import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createInvoice } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { description, amount, currency = "nok" } = await req.json()

    if (!description || !amount) {
      return NextResponse.json({ error: "Description and amount are required" }, { status: 400 })
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

    // Get the user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "User does not have a Stripe customer ID" }, { status: 400 })
    }

    // Create the invoice
    const invoice = await createInvoice(profile.stripe_customer_id, description, amount, currency)

    // Save the invoice to the database
    const { data: invoiceData, error: invoiceError } = await supabase.from("invoices").insert({
      user_id: user.id,
      stripe_invoice_id: invoice.id,
      amount: amount,
      currency: currency,
      description: description,
      status: invoice.status,
      due_date: new Date(invoice.due_date * 1000).toISOString(),
      created_at: new Date().toISOString(),
    })

    if (invoiceError) {
      throw invoiceError
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

