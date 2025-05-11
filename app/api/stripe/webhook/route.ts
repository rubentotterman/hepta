import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature") as string
  const webhookSecret = "whsec_gMh8MmHSkC6qztCNILXZroXie1gpqFvQ"

  let event

  try {
    if (!webhookSecret || process.env.NODE_ENV === "development") {
      // In development without a webhook secret, log the payload and fake a successful response
      console.log("⚠️ Webhook secret not found or in development mode, skipping signature verification")
      try {
        event = JSON.parse(body)
      } catch (err) {
        console.log(`❌ Error parsing webhook body: ${err}`)
        return NextResponse.json({ error: "Failed to parse webhook body" }, { status: 400 })
      }
    } else {
      // In production with a webhook secret, verify the signature
      try {
        if (!stripe) {
          throw new Error("Stripe instance is not initialized")
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.log(`❌ Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Log the event for debugging
  console.log(`✅ Webhook received: ${event.type}`)

  const supabase = createRouteHandlerClient({ cookies })

  // Handle the event
  try {
    switch (event.type) {
      case "invoice.paid":
        const invoice = event.data.object as any
        console.log(`💰 Invoice paid: ${invoice.id}`)

        // Update the invoice status in your database
        try {
          const { data, error } = await supabase
            .from("invoices")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("stripe_invoice_id", invoice.id)

          if (error) throw error
          console.log("✅ Invoice status updated in database")
        } catch (error) {
          console.error("❌ Error updating invoice status:", error)
        }
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as any
        console.log(`❌ Invoice payment failed: ${failedInvoice.id}`)

        // Update the invoice status in your database
        try {
          const { data, error } = await supabase
            .from("invoices")
            .update({ status: "payment_failed" })
            .eq("stripe_invoice_id", failedInvoice.id)

          if (error) throw error
          console.log("✅ Invoice status updated in database")
        } catch (error) {
          console.error("❌ Error updating invoice status:", error)
        }
        break

      case "customer.created":
        const customer = event.data.object as any
        console.log(`👤 Customer created: ${customer.id}`)
        break

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error(`❌ Error handling webhook: ${error}`)
    // Continue processing even if there's an error
  }

  return NextResponse.json({ received: true })
}

