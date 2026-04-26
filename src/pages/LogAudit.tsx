import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../auth'

interface Department {
  department_id: number
  name: string
}

function LogAudit() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentId, setDepartmentId] = useState('')
  const [isoSection, setIsoSection] = useState('')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [completedDate, setCompletedDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8080/departments', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => setDepartments(data))
  }, [])

  async function handleSubmit() {
    if (!departmentId || !isoSection || !result || !completedDate) {
      setError('Please fill in all required fields.')
      return
    }

    setError('')

    try {
      const response = await fetch('http://localhost:8080/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          department_id: parseInt(departmentId),
          iso_section: isoSection,
          result,
          notes,
          completed_date: completedDate
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)

    } catch (err) {
      setError('Could not connect to server.')
    }
  }

  const inputStyle = {
    fontFamily: 'var(--font)',
    fontSize: '14px',
    padding: '9px 12px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    outline: 'none',
    width: '100%',
    background: 'var(--white)',
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500' as const,
    marginBottom: '5px',
    display: 'block'
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--navy)', marginBottom: '24px' }}>
        Log Audit
      </h1>

      <div style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Department</label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              style={{
                ...inputStyle,
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Select department...</option>
              {departments.map(d => (
                <option key={d.department_id} value={d.department_id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>ISO 9001 Section</label>
            <input
              type="text"
              value={isoSection}
              onChange={e => setIsoSection(e.target.value)}
              placeholder="e.g. 8.4.2"
              style={{ ...inputStyle, fontFamily: 'var(--mono)', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Result</label>
            <select
              value={result}
              onChange={e => setResult(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select result...</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Completed Date</label>
            <input
              type="date"
              value={completedDate}
              onChange={e => setCompletedDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notes & Observations</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe findings..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {error && (
          <div style={{ fontSize: '13px', color: 'var(--fail)' }}>{error}</div>
        )}

        {success && (
          <div style={{ fontSize: '13px', color: 'var(--pass)' }}>
            Audit logged successfully. Redirecting...
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
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
            }}
          >
            Submit audit
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '9px 18px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--white)',
              color: 'var(--navy)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogAudit