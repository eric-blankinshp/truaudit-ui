import { useEffect, useState } from 'react'
import { getToken, getUser } from '../auth'

interface Audit {
  audit_id: number
  department_name: string
  iso_section: string
  result: string
  status: string
  completed_date: string
  auditor_name: string
}

function Results() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')
  const user = getUser()

  useEffect(() => {
    fetchAudits()
  }, [departmentFilter, resultFilter])

  async function fetchAudits() {
    setLoading(true)
    let url = 'http://localhost:8080/audits?'
    if (departmentFilter) url += `department_id=${departmentFilter}&`
    if (resultFilter) url += `result=${resultFilter}&`

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await response.json()
      setAudits(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleReview(audit_id: number) {
    await fetch(`http://localhost:8080/audits/${audit_id}/review`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    fetchAudits()
  }

  async function handleClose(audit_id: number) {
    const response = await fetch(`http://localhost:8080/audits/${audit_id}/close`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    const data = await response.json()
    if (!response.ok) {
      alert(data.error)
      return
    }
    fetchAudits()
  }

  function getBadgeStyle(value: string, type: 'result' | 'status') {
    if (type === 'result') {
      return {
        fontSize: '11px',
        fontWeight: '600' as const,
        padding: '3px 8px',
        borderRadius: '4px',
        background: value === 'pass' ? 'var(--pass-bg)' : 'var(--fail-bg)',
        color: value === 'pass' ? 'var(--pass)' : 'var(--fail)',
      }
    }
    return {
      fontSize: '11px',
      fontWeight: '600' as const,
      padding: '3px 8px',
      borderRadius: '4px',
      background: 'var(--off-white)',
      color: 'var(--gray)',
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--navy)', marginBottom: '24px' }}>
        Audit Results
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select
          value={resultFilter}
          onChange={e => setResultFilter(e.target.value)}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '14px',
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--white)',
            cursor: 'pointer',
          }}
        >
          <option value="">All results</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>

        <button
          onClick={() => { setResultFilter(''); setDepartmentFilter('') }}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--white)',
            color: 'var(--navy)',
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      </div>

      {/* Table */}
      {loading && <p style={{ color: 'var(--gray)' }}>Loading...</p>}

      {!loading && audits.length === 0 && (
        <p style={{ color: 'var(--gray)' }}>No audits found.</p>
      )}

      {!loading && audits.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'var(--white)' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Department</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>ISO Section</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Auditor</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Date</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Result</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Status</th>
              {user?.role === 'qms_manager' && (
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '500' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {audits.map((audit, i) => (
              <tr key={audit.audit_id} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)' }}>
                <td style={{ padding: '10px 14px' }}>{audit.department_name}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--gray)' }}>§{audit.iso_section}</td>
                <td style={{ padding: '10px 14px' }}>{audit.auditor_name}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--gray)' }}>
                  {new Date(audit.completed_date).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={getBadgeStyle(audit.result, 'result')}>{audit.result}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={getBadgeStyle(audit.status, 'status')}>{audit.status}</span>
                </td>
                {user?.role === 'qms_manager' && (
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {audit.status === 'submitted' && (
                        <button
                          onClick={() => handleReview(audit.audit_id)}
                          style={{
                            fontFamily: 'var(--font)',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            background: 'var(--white)',
                            color: 'var(--navy)',
                            cursor: 'pointer',
                          }}
                        >
                          Review
                        </button>
                      )}
                      {audit.status === 'in_review' && (
                        <button
                          onClick={() => handleClose(audit.audit_id)}
                          style={{
                            fontFamily: 'var(--font)',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            background: 'var(--navy)',
                            color: 'var(--white)',
                            cursor: 'pointer',
                          }}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Results