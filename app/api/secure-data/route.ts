import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { encryptData, decryptData } from "@/lib/encryption"

export async function POST(req: Request) {
  const { sensitiveInfo } = await req.json()
  const encrypted = encryptData(sensitiveInfo)

  const { error } = await supabase
    .from("secure_table")
    .insert([{ encrypted_data: encrypted }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ message: "Data lagret sikkert!" })
}

export async function GET() {
  const { data, error } = await supabase.from("secure_table").select("encrypted_data")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  const decryptedData = data.map((row) => decryptData(row.encrypted_data))

  return NextResponse.json({ decryptedData })
}
