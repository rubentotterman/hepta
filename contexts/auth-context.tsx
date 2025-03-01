"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/auth-helpers-nextjs"

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  serverSession,
}: { children: React.ReactNode; serverSession: Session | null }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!serverSession)
  const [user, setUser] = useState<User | null>(serverSession?.user || null)
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      setIsLoggedIn(true)
      setUser(session.user)
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [supabase.auth])

  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, session })
      if (session) {
        setIsLoggedIn(true)
        setUser(session.user)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, checkAuth])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
    await checkAuth()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

