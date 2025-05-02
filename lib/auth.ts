import bcrypt from "bcrypt"

// Hash passord før lagring i Supabase
export async function hashPassword(password: string) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verifiser passord ved innlogging
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}
