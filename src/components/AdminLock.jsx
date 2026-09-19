import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLock() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { session, signIn } = useAuth()
  const navigate = useNavigate()

  // Already logged in, so the lock navigates directly to /admin
  const handleLockClick = () => {
    if (session) {
      navigate('/admin')
    } else {
      setIsOpen(true)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setIsOpen(false)
      setEmail('')
      setPassword('')
      navigate('/admin')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError('')
    setEmail('')
    setPassword('')
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10 rounded-lg bg-secondary"
                placeholder="you@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 rounded-lg bg-secondary pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-primary-strong text-xs bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full rounded-lg mt-1">
              {loading ? 'Authenticating...' : 'Enter'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </>
  )
}
