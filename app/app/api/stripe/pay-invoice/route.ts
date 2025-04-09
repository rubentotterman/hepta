import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { payInvoice } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json()

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Pay the invoice
    const invoice = await payInvoice(invoiceId)

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("Error paying invoice:", error)
    return NextResponse.json({ error: "Failed to pay invoice" }, { status: 500 })
  }
}

