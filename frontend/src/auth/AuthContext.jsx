import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './context'
import {
  fetchCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../services/auth'

const TOKEN_KEY = 'muda-movement-token'

function tokenExpiryDelay(token) {
  try {
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')))
    return typeof payload.exp === 'number' ? Math.max(0, payload.exp * 1000 - Date.now()) : 0
  } catch {
    return 0
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(sessionStorage.getItem(TOKEN_KEY)))
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let active = true

    if (!token) return () => { active = false }

    const expiryTimer = window.setTimeout(() => {
      sessionStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      setLoading(false)
      setAuthError('')
    }, tokenExpiryDelay(token))

    fetchCurrentUser(token)
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser)
      })
      .catch((error) => {
        if (!active) return
        if (error.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
          setLoading(false)
          return
        }
        setAuthError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      window.clearTimeout(expiryTimer)
    }
  }, [token])

  const acceptSession = useCallback((result) => {
    sessionStorage.setItem(TOKEN_KEY, result.token)
    setUser(result.user)
    setToken(result.token)
    setLoading(false)
    setAuthError('')
  }, [])

  const login = useCallback(async (email, password) => {
    acceptSession(await loginRequest(email, password))
  }, [acceptSession])

  const register = useCallback(async (name, email, password) => {
    acceptSession(await registerRequest(name, email, password))
  }, [acceptSession])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setLoading(false)
    setAuthError('')
  }, [])

  const setCurrentUser = useCallback((currentUser) => {
    setUser(currentUser)
  }, [])

  const retryAuthentication = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setAuthError('')
    try {
      const result = await fetchCurrentUser(token)
      setUser(result.user)
    } catch (error) {
      if (error.status === 401) {
        logout()
      } else {
        setAuthError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }, [logout, token])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authError,
      login,
      register,
      logout,
      setCurrentUser,
      retryAuthentication,
    }),
    [user, token, loading, authError, login, register, logout, setCurrentUser, retryAuthentication],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
