import { NavLink } from 'react-router-dom'

function Navbar() {
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
    </nav>
  )
}

export default Navbar