import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the user is an admin (you'll need to implement this check)
    // For now, we'll allow any authenticated user to access this endpoint
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the user from Supabase
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, stripe_customer_id, created_at")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error in admin/users/[id] API:", error)
    return NextResponse.json(
      { error: `Failed to fetch user: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

