import { useState } from 'react'
import { Eye, EyeOff, Lock, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLock() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { session, signIn } = useAuth()
  const navigate = useNavigate()

  // Already logged in — lock navigates directly to /admin
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
      {/* Ghost lock — invisible until hovered */}
      <button
        onClick={handleLockClick}
        className="fixed bottom-6 right-6 z-50 p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500 text-gray-700 hover:text-[#db0a0a] focus:outline-none cursor-pointer"
        aria-label="Admin login"
      >
        <Lock size={14} />
      </button>

      {/* Login modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="p-2 bg-[#db0a0a]/10 rounded-lg">
                <Lock size={16} className="text-[#db0a0a]" />
              </div>
              <div>
                <h2 className="text-white font-semibold tracking-tight">Admin Access</h2>
                <p className="text-gray-600 text-xs mt-0.5">Authorized personnel only</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#db0a0a]/50 transition-colors"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#db0a0a]/50 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[#db0a0a] text-xs bg-[#db0a0a]/10 border border-[#db0a0a]/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#db0a0a] hover:bg-[#b50808] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-1"
              >
                {loading ? 'Authenticating...' : 'Enter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
