"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/auth-helpers-nextjs"

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  sessionToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<{ isLoggedIn: boolean; user: User | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  serverSession,
}: { children: React.ReactNode; serverSession: Session | null }) {
  // Start in a logged out state regardless of server session
  // This ensures the app always starts logged out when run locally
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()

  // Improve the auth state management
  const checkAuth = useCallback(async () => {
    console.log("Checking auth state...")
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Auth session:", session ? "Exists" : "None")

    if (session) {
      console.log("Setting logged in state to true")
      setIsLoggedIn(true)
      setUser(session.user)
      setSessionToken(session.access_token)
    } else {
      console.log("Setting logged in state to false")
      setIsLoggedIn(false)
      setUser(null)
      setSessionToken(null)
    }

    return { isLoggedIn: !!session, user: session?.user || null }
  }, [supabase.auth])

  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, session })
      if (session) {
        console.log("Auth state change: User logged in")
        setIsLoggedIn(true)
        setUser(session.user)
        setSessionToken(session.access_token)

        // Store session token in localStorage for easy access
        localStorage.setItem("sessionToken", session.access_token)
      } else {
        console.log("Auth state change: User logged out")
        setIsLoggedIn(false)
        setUser(null)
        setSessionToken(null)
        localStorage.removeItem("sessionToken")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, checkAuth])

  // Improve login function to ensure state is updated
  const login = async (email: string, password: string) => {
    console.log("Attempting login with email:", email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Login error:", error)
      throw error
    }

    console.log("Login successful:", data.session ? "Session exists" : "No session")

    if (data.session) {
      setIsLoggedIn(true)
      setUser(data.session.user)
      setSessionToken(data.session.access_token)

      // Store session token in localStorage for easy access
      localStorage.setItem("sessionToken", data.session.access_token)

      console.log("Auth state updated after login")
    }

    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
    setSessionToken(null)
    localStorage.removeItem("sessionToken")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, sessionToken, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

