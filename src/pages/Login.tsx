import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed.')
        return
      }

      // Store token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      navigate('/dashboard')

    } catch (err) {
      setError('Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--navy)',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          TruAudit Pro
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--gray)',
          marginBottom: '32px'
        }}>
          Sign in to your account
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                fontFamily: 'var(--font)',
                fontSize: '14px',
                padding: '9px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                fontFamily: 'var(--font)',
                fontSize: '14px',
                padding: '9px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: '13px', color: 'var(--fail)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '9px 18px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--navy)',
              color: 'var(--white)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              width: '100%',
              marginTop: '8px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login