import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LogAudit from './pages/LogAudit'
import Results from './pages/Results'
import Recommendations from './pages/Recommendations'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/log-audit" element={<><Navbar /><LogAudit /></>} />
        <Route path="/results" element={<><Navbar /><Results /></>} />
        <Route path="/recommendations" element={<><Navbar /><Recommendations /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App