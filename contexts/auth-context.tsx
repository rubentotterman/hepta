"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/auth-helpers-nextjs"
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/utils"

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  sessionToken: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<{ isLoggedIn: boolean; user: User | null }>
  createTestSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Test user data for local development
const TEST_USER = {
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
  },
}

// Generate a random token for test sessions
const generateTestToken = () => {
  return "test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

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

  // Use a ref to track if initial auth check has been performed
  const initialAuthCheckDone = useRef(false)

  // Improve the auth state management
  const checkAuth = useCallback(async () => {
    console.log("Checking auth state...")

    // First check for a test session
    const testSession = getLocalStorage("testSession")
    if (testSession) {
      try {
        console.log("Found test session:", testSession)
        setIsLoggedIn(true)
        setUser(testSession.user as User)
        setSessionToken(testSession.token)

        // Set a cookie to indicate we have a test session
        document.cookie = "hasTestSession=true; path=/"

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
    } else {
      console.log("Setting logged in state to false")
      setIsLoggedIn(false)
      setUser(null)
      setSessionToken(null)
    }

    return { isLoggedIn: !!session, user: session?.user || null }
  }, [supabase.auth])

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
      } else {
        // Don't log out if we have a test session
        if (!getLocalStorage("testSession")) {
          console.log("Auth state change: User logged out")
          setIsLoggedIn(false)
          setUser(null)
          setSessionToken(null)
          removeLocalStorage("sessionToken")
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Create a test session for local development
  const createTestSession = async () => {
    console.log("Creating test session")

    const token = generateTestToken()
    const testSession = {
      user: TEST_USER,
      token: token,
      created_at: new Date().toISOString(),
    }

    // Store the test session in localStorage
    setLocalStorage("testSession", testSession)
    setLocalStorage("sessionToken", token)

    // Set a cookie to indicate we have a test session
    document.cookie = "hasTestSession=true; path=/"

    // Update the auth state
    setIsLoggedIn(true)
    setUser(TEST_USER as User)
    setSessionToken(token)

    console.log("Test session created:", testSession)
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
    document.cookie = "hasTestSession=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Also clear Supabase session
    await supabase.auth.signOut()

    // Reset auth state
    setIsLoggedIn(false)
    setUser(null)
    setSessionToken(null)

    // Redirect to home
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        sessionToken,
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

