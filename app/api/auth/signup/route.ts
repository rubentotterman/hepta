import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const hashedPassword = await hashPassword(password)

  const { error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ message: "Bruker opprettet!" })
}
