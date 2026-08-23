import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'
import Modal from '../components/Modal'
import { HelmetEmpty } from '../components/icons'
import { formatLinkedDate } from '../format'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {now.toLocaleString('es', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </time>
  )
}

export default function Dashboard() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [linking, setLinking] = useState(false)
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { loadDevices() }, [])

  async function loadDevices() {
    setLoading(true)
    setLoadError('')
    try {
      const res = await API.get('/devices')
      setDevices(res.data || [])
    } catch {
      setLoadError('No se pudo cargar la flota de cascos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!deviceId) return setError('Ingresa un Device ID')
    setLinking(true)
    try {
      await API.post('/devices/link', { device_id: deviceId.toUpperCase() })
      setShowAdd(false)
      setDeviceId('')
      setError('')
      loadDevices()
    } catch (err) {
      setError(err.response?.data?.error || 'Device ID no encontrado')
    } finally {
      setLinking(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await API.delete(`/devices/${pendingDelete}`)
      setPendingDelete(null)
      loadDevices()
    } catch {
      setPendingDelete(null)
      setLoadError('Error al desvincular el casco.')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const filtered = devices.filter(d =>
    d.device_id.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <Clock />
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main id="contenido" className="page">
        <div className="page-head">
          <div>
            <h1>Cascos vinculados</h1>
            <p>Abre la consola de un casco para ver el stream y la evidencia de caídas.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setShowAdd(true)}>
            Vincular casco
          </button>
        </div>

        <div className="stat-row">
          <div className="stat-chip">
            <small>Flota</small>
            <strong>{loading ? '—' : devices.length}</strong>
          </div>
        </div>

        {devices.length > 0 && (
          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="Filtrar por Device ID"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Filtrar cascos por Device ID"
            />
          </div>
        )}

        {loading && <div className="loading-box">Cargando flota…</div>}

        {!loading && loadError && (
          <div className="error-box">
            <h2>Error de conexión</h2>
            <p>{loadError}</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={loadDevices}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !loadError && devices.length === 0 && (
          <div className="empty">
            <HelmetEmpty />
            <h2>Ningún casco vinculado</h2>
            <p>
              Ingresa el Device ID impreso en el portal de configuración del casco
              para empezar a monitorear caídas.
            </p>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowAdd(true)}>
              Vincular casco
            </button>
          </div>
        )}

        {!loading && !loadError && devices.length > 0 && filtered.length === 0 && (
          <div className="empty">
            <h2>Sin coincidencias</h2>
            <p>Ningún Device ID coincide con “{query}”.</p>
          </div>
        )}

        {!loading && !loadError && filtered.length > 0 && (
          <div className="fleet-grid">
            {filtered.map(d => (
              <article key={d.device_id} className="device-card">
                <div>
                  <p className="device-card-id">{d.device_id}</p>
                  <p className="device-card-meta">
                    Vinculado el {formatLinkedDate(d.created_at)}
                  </p>
                </div>
                <div className="device-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate(`/device/${d.device_id}`)}
                  >
                    Abrir consola
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setPendingDelete(d.device_id)}
                  >
                    Desvincular
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <Modal
          title="Vincular casco"
          onClose={() => {
            setShowAdd(false)
            setError('')
            setDeviceId('')
          }}
        >
          <p>Ingresa el Device ID que aparece en el portal de configuración del casco.</p>
          <form onSubmit={handleAdd}>
            <div className="field field-mono">
              <label htmlFor="new-device-id">Device ID</label>
              <input
                id="new-device-id"
                placeholder="CASCO-A1B2C3"
                value={deviceId}
                onChange={e => {
                  setDeviceId(e.target.value.toUpperCase())
                  setError('')
                }}
                autoComplete="off"
              />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={linking}>
                {linking ? 'Vinculando…' : 'Vincular'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setShowAdd(false)
                  setError('')
                  setDeviceId('')
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Desvincular casco" onClose={() => setPendingDelete(null)}>
          <p>
            ¿Quitar <strong>{pendingDelete}</strong> de esta cuenta? El casco
            dejará de aparecer en la flota.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>
              Desvincular
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
