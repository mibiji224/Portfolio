import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// AuthContext only ever holds a session for the admin address (any other
// Google account is signed straight back out), so a session is enough here.
export default function ProtectedRoute({ children }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/" replace />
}
