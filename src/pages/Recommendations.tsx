import { useEffect, useState } from 'react'
import { getToken, getUser } from '../auth'

interface Recommendation {
  recommendation_id: number
  submitted_by_name: string
  department_name: string
  description: string
  status: string
  submitted_at: string
  delinquent: boolean
}

interface Department {
  department_id: number
  name: string
}

function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentId, setDepartmentId] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    fetchRecommendations()
    fetchDepartments()
  }, [])

  async function fetchRecommendations() {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/recommendations', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await response.json()
      setRecommendations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDepartments() {
    const response = await fetch('http://localhost:8080/departments', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    const data = await response.json()
    setDepartments(data)
  }

  async function handleSubmit() {
    if (!departmentId || !description) {
      setError('Please fill in all fields.')
      return
    }
    setError('')

    try {
      const response = await fetch('http://localhost:8080/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          department_id: parseInt(departmentId),
          description
        })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error)
        return
      }

      setSuccess(true)
      setDepartmentId('')
      setDescription('')
      fetchRecommendations()
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      setError('Could not connect to server.')
    }
  }

  async function handleAddress(id: number, status: string) {
    const response = await fetch(`http://localhost:8080/recommendations/${id}/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status })
    })
    const data = await response.json()
    if (!response.ok) {
      alert(data.error)
      return
    }
    fetchRecommendations()
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

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--navy)', marginBottom: '24px' }}>
        Recommendations
      </h1>

      {/* Submit form — auditors only */}
      {user?.role === 'auditor' && (
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px' }}>
            Submit a recommendation
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
                Department
              </label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select department...</option>
                {departments.map(d => (
                  <option key={d.department_id} value={d.department_id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your recommendation..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {error && <div style={{ fontSize: '13px', color: 'var(--fail)' }}>{error}</div>}
            {success && <div style={{ fontSize: '13px', color: 'var(--pass)' }}>Recommendation submitted.</div>}

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
                alignSelf: 'flex-start'
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Recommendations list */}
      {loading && <p style={{ color: 'var(--gray)' }}>Loading...</p>}

      {!loading && recommendations.length === 0 && (
        <p style={{ color: 'var(--gray)' }}>No recommendations yet.</p>
      )}

      {recommendations.map(rec => (
        <div key={rec.recommendation_id} style={{
          background: 'var(--white)',
          border: `1px solid ${rec.delinquent ? 'var(--fail)' : 'var(--border)'}`,
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{rec.department_name}</div>
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '2px' }}>
                {rec.submitted_by_name} · {new Date(rec.submitted_at).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {rec.delinquent && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'var(--fail-bg)',
                  color: 'var(--fail)',
                }}>
                  Delinquent
                </span>
              )}
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'var(--off-white)',
                color: 'var(--gray)',
              }}>
                {rec.status}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
            {rec.description}
          </p>

          {user?.role === 'qms_manager' && rec.status === 'open' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleAddress(rec.recommendation_id, 'resolved')}
                style={{
                  fontFamily: 'var(--font)',
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'var(--navy)',
                  color: 'var(--white)',
                  cursor: 'pointer',
                }}
              >
                Mark resolved
              </button>
              <button
                onClick={() => handleAddress(rec.recommendation_id, 'not_feasible')}
                style={{
                  fontFamily: 'var(--font)',
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  background: 'var(--white)',
                  color: 'var(--navy)',
                  cursor: 'pointer',
                }}
              >
                Not feasible
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Recommendations
