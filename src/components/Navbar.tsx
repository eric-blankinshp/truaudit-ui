import { NavLink, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../auth'

function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: 'var(--navy)',
      display: 'flex',
      alignItems: 'center',
      height: '52px',
      padding: '0 24px',
      gap: '4px'
    }}>
      <div style={{
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--white)',
        marginRight: '24px'
      }}>
        TruAudit Pro
      </div>

      <NavLink to="/dashboard" style={({ isActive }) => ({
        fontSize: '13px',
        color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.5)',
        padding: '0 14px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderBottom: isActive ? '2px solid white' : '2px solid transparent'
      })}>
        Dashboard
      </NavLink>

      <NavLink to="/log-audit" style={({ isActive }) => ({
        fontSize: '13px',
        color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.5)',
        padding: '0 14px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderBottom: isActive ? '2px solid white' : '2px solid transparent'
      })}>
        Log Audit
      </NavLink>

      <NavLink to="/results" style={({ isActive }) => ({
        fontSize: '13px',
        color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.5)',
        padding: '0 14px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderBottom: isActive ? '2px solid white' : '2px solid transparent'
      })}>
        Results
      </NavLink>

      <NavLink to="/recommendations" style={({ isActive }) => ({
        fontSize: '13px',
        color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.5)',
        padding: '0 14px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderBottom: isActive ? '2px solid white' : '2px solid transparent'
      })}>
        Recommendations
      </NavLink>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          {user?.name}
        </span>
        <button
          onClick={handleLogout}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '13px',
            fontWeight: '500',
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: 'var(--white)',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar