const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('Server mengirim respons yang tidak dapat dibaca.')
  }

  if (!response.ok) {
    const error = new Error(payload.error || 'Permintaan tidak dapat diproses.')
    error.status = response.status
    throw error
  }

  return payload
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(name, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function requestPasswordReset(email) {
  return request('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token, password) {
  return request('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export function fetchCurrentUser(token) {
  return request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updateProfile(token, name, email) {
  return request('/api/auth/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email }),
  })
}

export function updatePassword(token, currentPassword, newPassword) {
  return request('/api/auth/me/password', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function deleteAccount(token, password) {
  return request('/api/auth/me', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password }),
  })
}

export function fetchPublicConfig() {
  return request('/api/config')
}
