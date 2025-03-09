"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/auth-helpers-nextjs"
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/utils"

// Update the AuthContextType interface to include role
interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  sessionToken: string | null
  userRole: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<{ isLoggedIn: boolean; user: User | null }>
  createTestSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Add role to the TEST_USER object
const TEST_USER = {
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
  },
  role: "admin", // Add this line
}

// Generate a random token for test sessions
const generateTestToken = () => {
  return "test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export function AuthProvider({
  children,
  serverSession,
}: { children: React.ReactNode; serverSession: Session | null }) {
  // Start with logged out state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  // In the AuthProvider component, add a state for userRole
  const [userRole, setUserRole] = useState<string | null>(null)
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()

  // Use a ref to track if initial auth check has been performed
  const initialAuthCheckDone = useRef(false)

  const ensureStripeCustomer = useCallback(async (user: User) => {
    if (!user || !user.email) return null

    try {
      const response = await fetch("/api/stripe/create-customer-for-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to create Stripe customer:", errorText)
        return null
      }

      const { customerId } = await response.json()
      return customerId
    } catch (error) {
      console.error("Error ensuring Stripe customer:", error)
      return null
    }
  }, [])

  // Update the checkAuth function to fetch and set the user's role
  const checkAuth = useCallback(async () => {
    console.log("Checking auth state...")

    // First check for a session cookie
    const sessionCookie = getCookie("session")
    if (sessionCookie === "authenticated") {
      console.log("Found authenticated session cookie")
    }

    // First check for a test session
    const testSession = getLocalStorage("testSession")
    if (testSession) {
      try {
        console.log("Found test session:", testSession)
        setIsLoggedIn(true)
        setUser(testSession.user as User)
        setSessionToken(testSession.token)
        setUserRole(testSession.user.role || "customer") // Set role from test session

        // Set a cookie to indicate we have a test session
        document.cookie = "hasTestSession=true; path=/"

        // Ensure the test user has a Stripe customer ID
        if (process.env.NODE_ENV === "development") {
          ensureStripeCustomer(testSession.user as User)
        }

        return { isLoggedIn: true, user: testSession.user as User }
      } catch (error) {
        console.error("Error parsing test session:", error)
        removeLocalStorage("testSession")
      }
    }

    // If no test session, check Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Auth session:", session ? "Exists" : "None")

    if (session) {
      console.log("Setting logged in state to true")
      setIsLoggedIn(true)
      setUser(session.user)
      setSessionToken(session.access_token)

      // Set session cookie
      document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

      // Fetch user role from profiles table
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (!error && profile) {
          setUserRole(profile.role || "customer")
        } else {
          setUserRole("customer") // Default role
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
        setUserRole("customer") // Default role
      }

      // Ensure the user has a Stripe customer ID
      ensureStripeCustomer(session.user)
    } else {
      console.log("Setting logged in state to false")
      setIsLoggedIn(false)
      setUser(null)
      setSessionToken(null)
      setUserRole(null)

      // Clear session cookie
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
    }

    return { isLoggedIn: !!session, user: session?.user || null }
  }, [supabase.auth, ensureStripeCustomer])

  // Only run the initial auth check once when the component mounts
  useEffect(() => {
    if (!initialAuthCheckDone.current) {
      checkAuth()
      initialAuthCheckDone.current = true
    }
  }, [checkAuth])

  // Set up auth state change listener
  useEffect(() => {
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
        setLocalStorage("sessionToken", session.access_token)

        // Set session cookie
        document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`
      } else {
        // Don't log out if we have a test session
        if (!getLocalStorage("testSession")) {
          console.log("Auth state change: User logged out")
          setIsLoggedIn(false)
          setUser(null)
          setSessionToken(null)
          removeLocalStorage("sessionToken")

          // Clear session cookie
          document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Update the createTestSession function to include role
  const createTestSession = async () => {
    console.log("Creating test session")

    const token = generateTestToken()
    const testSession = {
      user: {
        ...TEST_USER,
        role: "admin", // Ensure the test user has admin role
      },
      token: token,
      created_at: new Date().toISOString(),
    }

    // Store the test session in localStorage
    setLocalStorage("testSession", testSession)
    setLocalStorage("sessionToken", token)

    // Set a cookie to indicate we have a test session
    document.cookie = "hasTestSession=true; path=/; SameSite=Strict; Secure"

    // Set a session cookie that expires in 7 days
    document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

    // Update the auth state
    setIsLoggedIn(true)
    setUser(TEST_USER as User)
    setSessionToken(token)
    setUserRole("admin") // Set role for test session

    console.log("Test session created:", testSession)

    // Ensure the test user has a Stripe customer ID
    if (process.env.NODE_ENV === "development") {
      await ensureStripeCustomer(TEST_USER as User)
    }
  }

  // Keep the original login function for completeness
  const login = async (email: string, password: string) => {
    console.log("Attempting login with email:", email)

    try {
      // Add a small delay before login attempt
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Login error:", error)
        return { success: false, error: error.message }
      }

      console.log("Login successful:", data.session ? "Session exists" : "No session")

      if (data.session) {
        setIsLoggedIn(true)
        setUser(data.session.user)
        setSessionToken(data.session.access_token)

        // Store session token in localStorage for easy access
        setLocalStorage("sessionToken", data.session.access_token)

        // Set session cookie
        document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

        console.log("Auth state updated after login")
      }

      return { success: true }
    } catch (error: any) {
      console.error("Login process error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    // Clear test session if it exists
    removeLocalStorage("testSession")
    removeLocalStorage("sessionToken")

    // Clear the test session cookie
    document.cookie = "hasTestSession=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Clear session cookie
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Also clear Supabase session
    await supabase.auth.signOut()

    // Reset auth state
    setIsLoggedIn(false)
    setUser(null)
    setSessionToken(null)

    // Redirect to home
    router.push("/")
  }

  // Include userRole in the context value
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        sessionToken,
        userRole, // Add this line
        login,
        logout,
        checkAuth,
        createTestSession,
      }}
    >
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

