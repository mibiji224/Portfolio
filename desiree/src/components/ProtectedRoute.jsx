import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/" replace />
}
