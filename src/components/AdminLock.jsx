import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Set just before leaving for Google, read when the session comes back.
const LOGIN_FLAG = 'admin-login-started'

export default function AdminLock() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { session, authError, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Returning from Google with the wrong account: show why.
  useEffect(() => {
    if (!authError) return
    setIsOpen(true)
    // The attempt failed, so don't let its flag redirect a later visit.
    try { sessionStorage.removeItem(LOGIN_FLAG) } catch { /* storage blocked */ }
  }, [authError])

  // Google sends the browser back to the site root, so the dashboard is
  // opened here once the session arrives, but only for a sign-in started from
  // this lock (not for a session restored on an ordinary visit).
  useEffect(() => {
    if (!session) return
    let started = false
    try {
      started = sessionStorage.getItem(LOGIN_FLAG) === '1'
      sessionStorage.removeItem(LOGIN_FLAG)
    } catch { /* storage blocked: the lock click still opens /admin */ }
    if (started) navigate('/admin', { replace: true })
  }, [session, navigate])

  // Already logged in, so the lock navigates directly to /admin
  const handleLockClick = () => {
    if (session) {
      navigate('/admin')
    } else {
      setIsOpen(true)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try { sessionStorage.setItem(LOGIN_FLAG, '1') } catch { /* see above */ }
    const { error } = await signInWithGoogle()
    // On success the browser leaves for Google, so there is nothing to close.
    if (error) {
      try { sessionStorage.removeItem(LOGIN_FLAG) } catch { /* see above */ }
      setLoading(false)
      setError(error.message)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError('')
  }

  return (
    <>
      {/* Ghost lock: invisible until hovered */}
      <button
        onClick={handleLockClick}
        className="fixed bottom-6 right-6 z-50 p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500 text-muted-foreground/60 hover:text-primary-strong focus:outline-none cursor-pointer"
        aria-label="Admin login"
      >
        <Lock size={14} />
      </button>

      {/* Login modal. Radix owns the focus trap, escape handling and scroll
          lock that the hand-rolled overlay did not have. */}
      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
        <DialogContent className="max-w-sm p-8">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock size={16} className="text-primary-strong" />
              </div>
              <div>
                <DialogTitle>Admin Access</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Authorized personnel only
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {(error || authError) && (
            <p className="mb-4 text-primary-strong text-xs bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
              {error || authError}
            </p>
          )}

          <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full rounded-lg h-10 gap-2">
            <img src="/logos/gsuite.svg" alt="" aria-hidden="true" className="h-4 w-4" />
            {loading ? 'Redirecting...' : 'Continue with Google'}
          </Button>
        </DialogContent>
      </Dialog>

    </>
  )
}
