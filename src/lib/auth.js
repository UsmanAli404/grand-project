// lib/authStatus.js
'use client'

import { supabase } from "@/lib/supabaseClient"

/**
 * Asynchronously checks if the user is authenticated.
 * @returns {Promise<{ isAuthenticated: boolean, session: object|null }>}
 */
export async function checkAuthStatus() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Auth check failed:", error.message)
      return { isAuthenticated: false, session: null }
    }

    const session = data.session
    return {
      isAuthenticated: !!session,
      session
    }
  } catch (err) {
    console.error("Unexpected error in auth check:", err)
    return { isAuthenticated: false, session: null }
  }
}