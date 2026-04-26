import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, getUser } from '../auth'

interface Audit {
  audit_id: number
  department_name: string
  iso_section: string
  result: string
  status: string
  completed_date: string
}

function Dashboard() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    fetchAudits()
  }, [])

  async function fetchAudits() {
    try {
      const response = await fetch('http://localhost:8080/audits', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error)
        return
      }
      // Auditors only see their in_work audits on dashboard
      const inWork = user?.role === 'auditor'
        ? data.filter((a: Audit) => a.status === 'in_work')
        : data
      setAudits(inWork)
    } catch (err) {
      setError('Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(audit_id: number) {
    try {
      const response = await fetch(`http://localhost:8080/audits/${audit_id}/submit`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error)
        return
      }
      fetchAudits()
    } catch (err) {
      alert('Could not connect to server.')
    }
  }

  function getBadgeStyle(result: string) {
    return {
      fontSize: '11px',
      fontWeight: '600',
      padding: '3px 8px',
      borderRadius: '4px',
      background: result === 'pass' ? 'var(--pass-bg)' : 'var(--fail-bg)',
      color: result === 'pass' ? 'var(--pass)' : 'var(--fail)',
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--navy)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>
          Welcome back, {user?.name}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500' }}>
          {user?.role === 'auditor' ? 'My In-Work Audits' : 'All Audits'}
        </h2>
        {user?.role === 'auditor' && (
          <button
            onClick={() => navigate('/log-audit')}
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
            }}
          >
            Log new audit
          </button>
        )}
      </div>

      {loading && <p style={{ color: 'var(--gray)' }}>Loading...</p>}
      {error && <p style={{ color: 'var(--fail)' }}>{error}</p>}

      {!loading && audits.length === 0 && (
        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>No audits found.</p>
      )}

      {audits.map(audit => (
        <div key={audit.audit_id} style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {audit.department_name}
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--gray)', marginTop: '2px' }}>
              ISO 9001 · §{audit.iso_section} · {new Date(audit.completed_date).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={getBadgeStyle(audit.result)}>{audit.result}</span>
            {user?.role === 'auditor' && audit.status === 'in_work' && (
              <button
                onClick={() => handleSubmit(audit.audit_id)}
                style={{
                  fontFamily: 'var(--font)',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--white)',
                  color: 'var(--navy)',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Dashboard