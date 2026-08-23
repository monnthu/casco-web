import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'
import { IconBack, IconInfo, IconLink } from '../components/icons'

export default function AddDevice() {
  const [deviceId, setDeviceId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleAdd(e) {
    e.preventDefault()
    if (!deviceId) return setError('Ingresá el ID del casco.')
    setBusy(true)
    setError('')
    try {
      await API.post('/devices/link', { device_id: deviceId.toUpperCase() })
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Ese ID ya está vinculado a otra cuenta o no existe.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell grid-tech">
      <header className="topbar">
        <div className="topbar-left">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            <IconBack /> <span className="hide-sm">Volver a la flota</span>
          </button>
          <span className="rule hide-sm" />
          <Logo />
        </div>
      </header>
      <main className="page add-wrap">
        <div className="add-card">
          <div className="add-title">
            <span className="hat-tile"><IconLink /></span>
            <div>
              <h1>Vincular casco</h1>
              <p>Sumá un nuevo casco C.A.S.C.O. a tu flota</p>
            </div>
          </div>
          <form className="add-box" onSubmit={handleAdd} noValidate>
            <p className="sub" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Ingresá el identificador impreso en la etiqueta del casco. Lo vas a encontrar en la parte interna, junto al módulo ESP32.
            </p>
            {error && <div className="banner-error" role="alert">{error}</div>}
            {success && <div className="banner-ok">Casco vinculado correctamente. Redirigiendo a la flota…</div>}
            <div className="field field-mono">
              <label htmlFor="add-device-id">ID del casco</label>
              <input
                id="add-device-id"
                placeholder="CASCO-XXXX"
                value={deviceId}
                onChange={e => setDeviceId(e.target.value.toUpperCase())}
                autoComplete="off"
              />
              <p className="field-hint">Se guarda siempre en mayúsculas.</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={busy || success}>
                {busy ? 'Vinculando…' : 'Vincular'}
              </button>
            </div>
          </form>
          <div className="footnote" style={{ marginTop: '1.1rem' }}>
            <IconInfo />
            <p>El casco debe estar encendido y conectado al Wi-Fi del sitio para empezar a transmitir video y alertas apenas se vincule.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
