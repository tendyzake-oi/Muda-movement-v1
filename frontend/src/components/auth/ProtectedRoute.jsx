import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../auth/useAuth'
import './ProtectedRoute.css'

export default function ProtectedRoute({ children }) {
  const { user, loading, authError, retryAuthentication } = useAuth()
  const location = useLocation()

  if (loading) {
    return <main className="auth-state" role="status">Memeriksa sesi Anda...</main>
  }

  if (authError) {
    return (
      <main className="auth-state auth-state--error">
        <p>{authError}</p>
        <button type="button" onClick={retryAuthentication}>Coba lagi</button>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
