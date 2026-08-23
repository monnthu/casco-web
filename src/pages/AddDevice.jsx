import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'

export default function AddDevice() {
  const [deviceId, setDeviceId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleAdd(e) {
    e.preventDefault()
    if (!deviceId) return setError('Ingresa el Device ID')
    setBusy(true)
    setError('')
    try {
      await API.post('/devices/link', { device_id: deviceId.toUpperCase() })
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Device ID no encontrado')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Logo />
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← Flota
        </button>
      </header>
      <main className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
        <form className="auth-card" onSubmit={handleAdd} noValidate>
          <h2>Vincular casco</h2>
          <p className="sub">
            Ingresa el Device ID que aparece en el portal de configuración del casco.
          </p>
          <div className="field field-mono">
            <label htmlFor="add-device-id">Device ID</label>
            <input
              id="add-device-id"
              placeholder="CASCO-A1B2C3"
              value={deviceId}
              onChange={e => setDeviceId(e.target.value.toUpperCase())}
              autoComplete="off"
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-ok">Dispositivo vinculado. Redirigiendo…</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy || success}>
            {busy ? 'Vinculando…' : 'Vincular'}
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={() => navigate('/')}>
            Cancelar
          </button>
        </form>
      </main>
    </div>
  )
}
