import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Anyone with a Google account can complete Google sign-in, so the session
// alone proves nothing: only this address counts as the admin. This check is
// a convenience. The database policies (supabase/admin_google_auth.sql) are
// what actually keep everyone else from writing.
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()
const isAdminSession = (session) =>
  Boolean(ADMIN_EMAIL) && session?.user?.email?.toLowerCase() === ADMIN_EMAIL

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // A Google account that isn't the admin is signed straight back out.
    const accept = (next) => {
      if (next && !isAdminSession(next)) {
        setAuthError('That Google account is not authorized for admin access.')
        supabase.auth.signOut()
        setSession(null)
        return
      }
      setSession(next)
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => accept(session))
      .catch(() => {})
      .finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      accept(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Redirects to Google and back; the session is picked up from the URL on return.
  const signInWithGoogle = () => {
    setAuthError('')
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: ADMIN_EMAIL ? { login_hint: ADMIN_EMAIL, prompt: 'select_account' } : undefined,
      },
    })
  }

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, loading, authError, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
