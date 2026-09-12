import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login, isAdmin } = useAuth()
  const navigate           = useNavigate()

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Redirect ke dashboard jika sudah login
  useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard', { replace: true })
  }, [isAdmin, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError('Email atau password salah. Coba lagi.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login" id="admin-login-page">
      <div className="admin-login__card">
        <p className="admin-login__logo">DOMAIN</p>
        <p className="admin-login__subtitle">Login sebagai Admin</p>

        {error && (
          <div className="admin-login__error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Admin login form">
          <div className="form-group">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="admin-login__btn"
            id="admin-login-submit"
            disabled={loading}
          >
            {loading ? 'Masuk...' : 'Masuk →'}
          </button>
        </form>
      </div>
    </div>
  )
}
