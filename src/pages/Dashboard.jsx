import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'
import Modal from '../components/Modal'
import Clock from '../components/Clock'
import { HelmetEmpty, IconHat, IconLink, IconLogout, IconQuestion, IconSearch, IconTrash } from '../components/icons'
import { formatLinkedDate } from '../format'

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
  const username = localStorage.getItem('username') || 'Supervisor'
  const initial = username.slice(0, 1).toUpperCase()

  useEffect(() => { loadDevices() }, [])

  async function loadDevices() {
    setLoading(true)
    setLoadError('')
    try {
      const res = await API.get('/devices')
      setDevices(res.data || [])
    } catch {
      setLoadError('Revisá tu conexión e intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!deviceId) return setError('Ingresá el ID del casco.')
    setLinking(true)
    try {
      await API.post('/devices/link', { device_id: deviceId.toUpperCase() })
      setShowAdd(false)
      setDeviceId('')
      setError('')
      loadDevices()
    } catch (err) {
      setError(err.response?.data?.error || 'Ese ID ya está vinculado a otra cuenta o no existe.')
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
      setLoadError('No se pudo desvincular el casco.')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function closeAdd() {
    setShowAdd(false)
    setError('')
    setDeviceId('')
  }

  const filtered = devices.filter(d =>
    d.device_id.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="shell grid-tech">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <Clock className="clock hide-sm" />
          <span className="rule hide-sm" />
          <span className="user-chip">
            <span className="user-avatar">{initial}</span>
            <span>{username}</span>
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            <IconLogout />
            <span className="hide-sm">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main id="contenido" className="page">
        <div className="page-head">
          <div>
            <h1>Cascos vinculados</h1>
            <p>Seleccioná un casco para ver su cámara en vivo y el historial de caídas.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <IconLink /> Vincular casco
          </button>
        </div>

        <div className="stat-chip">
          <span className="stat-icon"><IconHat /></span>
          <div>
            <strong>{loading ? '—' : devices.length}</strong>
            <small>Cascos vinculados</small>
          </div>
        </div>

        {devices.length > 0 && (
          <div className="search-wrap">
            <IconSearch />
            <label htmlFor="device-search" className="sr-only">Buscar por ID de casco</label>
            <input
              id="device-search"
              type="search"
              placeholder="Buscar por ID de casco…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        )}

        {loading && <div className="loading-box">Cargando flota…</div>}

        {!loading && loadError && (
          <div className="error-box">
            <h2>No pudimos cargar tus cascos</h2>
            <p>{loadError}</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={loadDevices}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !loadError && devices.length === 0 && (
          <div className="empty">
            <HelmetEmpty />
            <h2>Todavía no vinculaste ningún casco</h2>
            <p>Vinculá tu primer casco C.A.S.C.O. para empezar a recibir alertas de caída y ver la cámara en vivo.</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowAdd(true)}>
              <IconLink /> Vincular casco
            </button>
          </div>
        )}

        {!loading && !loadError && devices.length > 0 && filtered.length === 0 && (
          <div className="empty">
            <h2>Sin coincidencias</h2>
            <p>Ningún ID coincide con “{query}”.</p>
          </div>
        )}

        {!loading && !loadError && filtered.length > 0 && (
          <div className="fleet-grid">
            {filtered.map(d => (
              <article key={d.device_id} className="device-card">
                <div className="device-card-top">
                  <span className="hat-tile"><IconHat size={18} /></span>
                  <span className="status-badge">
                    <IconQuestion /> Sin datos de conexión
                  </span>
                </div>
                <div>
                  <p className="device-card-id">{d.device_id}</p>
                  <p className="device-card-meta">Vinculado el {formatLinkedDate(d.created_at)}</p>
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
                    className="btn-icon"
                    aria-label={`Desvincular ${d.device_id}`}
                    onClick={() => setPendingDelete(d.device_id)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <div className="mobile-cta">
        <button type="button" className="btn btn-primary btn-block" onClick={() => setShowAdd(true)}>
          <IconLink /> Vincular casco
        </button>
      </div>

      {showAdd && (
        <Modal title="Vincular casco" onClose={closeAdd}>
          <p>Ingresá el identificador impreso en la etiqueta del casco.</p>
          <form onSubmit={handleAdd} noValidate>
            <div className="field field-mono">
              <label htmlFor="new-device-id">ID del casco</label>
              <input
                id="new-device-id"
                placeholder="CASCO-XXXX"
                value={deviceId}
                onChange={e => {
                  setDeviceId(e.target.value.toUpperCase())
                  setError('')
                }}
                autoComplete="off"
              />
            </div>
            {error && <div className="banner-error" role="alert">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeAdd}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={linking}>
                {linking ? 'Vinculando…' : 'Vincular'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <Modal title={`Desvincular ${pendingDelete}`} onClose={() => setPendingDelete(null)}>
          <p>
            Vas a dejar de recibir alertas de caída y video de este casco. Podés revertirlo volviendo a vincularlo.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>Cancelar</button>
            <button type="button" className="btn btn-critical" onClick={confirmDelete}>Desvincular</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
