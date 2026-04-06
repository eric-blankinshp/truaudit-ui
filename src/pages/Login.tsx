import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    console.log('logging in with', email, password)
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
            <label style={{ fontSize: '13px', fontWeight: '500' }}>
              Email
            </label>
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
            <label style={{ fontSize: '13px', fontWeight: '500' }}>
              Password
            </label>
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
            style={{
              fontFamily: 'var(--font)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '9px 18px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--navy)',
              color: 'var(--white)',
              cursor: 'pointer',
              width: '100%',
              marginTop: '8px',
            }}
          >
            Sign in
          </button>

        </div>
      </div>
    </div>
  )
}

export default Login