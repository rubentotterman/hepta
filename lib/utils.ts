import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe localStorage access
export function getLocalStorage(key: string, defaultValue: any = null) {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const value = localStorage.getItem(key)
    if (value === null) {
      return defaultValue
    }
    return JSON.parse(value)
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setLocalStorage(key: string, value: any) {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

export function removeLocalStorage(key: string) {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
  }
}

// Safe session token access
export function getSessionToken() {
  if (typeof window === "undefined") {
    return null
  }

  // First try to get from localStorage
  const token = localStorage.getItem("sessionToken")
  if (token) {
    return token
  }

  // If no token in localStorage, check for test session
  const testSession = getLocalStorage("testSession")
  if (testSession && testSession.token) {
    return testSession.token
  }

  // No token found
  return null
}

