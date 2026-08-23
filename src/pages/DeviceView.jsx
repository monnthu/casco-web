import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import API from '../api'
import AlertBanner from '../components/AlertBanner'
import EventList from '../components/EventList'
import Logo from '../components/Logo'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://casco-backend.onrender.com'

function playAttentionTone() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  const ctx = new Ctx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.value = 880
  gain.gain.value = 0.05
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.18)
  osc.onended = () => ctx.close()
}

export default function DeviceView() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [alert, setAlert] = useState(null)
  const [wsStatus, setWsStatus] = useState('conectando')
  const [frame, setFrame] = useState(null)
  const [flashOn, setFlashOn] = useState(false)
  const [flashError, setFlashError] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  const socketRef = useRef(null)
  const soundOnRef = useRef(false)

  useEffect(() => { soundOnRef.current = soundOn }, [soundOn])

  useEffect(() => {
    API.get(`/events/${deviceId}`)
      .then(res => setEvents(res.data))
      .catch(err => console.error('[EVENTS] Error:', err))

    const socket = io(BACKEND_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setWsStatus('conectado')
      socket.emit('join_device', deviceId)
    })

    socket.on('frame', (data) => {
      if (data.device_id === deviceId) setFrame(data.image)
    })

    socket.on('connect_error', () => setWsStatus('error'))
    socket.on('disconnect', () => setWsStatus('desconectado'))

    socket.on('fall_alert', (data) => {
      API.get(`/events/${deviceId}`)
        .then(res => setEvents(res.data))
        .catch(() => setEvents(prev => [data, ...prev]))
      setAlert(data)
      if (soundOnRef.current) playAttentionTone()
    })

    return () => socket.disconnect()
  }, [deviceId])

  async function toggleFlash() {
    setFlashError('')
    try {
      const res = await API.post(`/devices/${deviceId}/flash`)
      if (res.status === 200) setFlashOn(f => !f)
    } catch (err) {
      setFlashError('No se pudo conmutar el flash.')
      console.error('[FLASH] Error:', err.message)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const live = Boolean(frame)
  const wsOk = wsStatus === 'conectado'

  return (
    <div className="shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="topbar">
        <div className="topbar-left">
          <Logo />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            ← Flota
          </button>
          <span className="device-id-display">{deviceId}</span>
          <span className={`pill ${wsOk ? 'pill-ok' : 'pill-bad'}`}>
            <span className="pill-dot" />
            {wsStatus}
          </span>
        </div>
        <div className="topbar-right">
          <label className="toggle">
            <input
              type="checkbox"
              checked={soundOn}
              onChange={e => setSoundOn(e.target.checked)}
            />
            Alerta sonora
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main id="contenido" className="page">
        {alert && (
          <AlertBanner alert={alert} onAcknowledge={() => setAlert(null)} />
        )}

        <div className="console-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Stream en vivo</h2>
                <p className="panel-hint">Cámara ESP32-CAM del casco</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-ghost btn-sm ${flashOn ? 'flash-on' : ''}`}
                  onClick={toggleFlash}
                  aria-pressed={flashOn}
                >
                  {flashOn ? 'Flash encendido' : 'Flash apagado'}
                </button>
                <span className={`pill ${live ? 'pill-ok' : ''}`}>
                  <span className="pill-dot" />
                  {live ? 'En vivo' : 'Sin señal'}
                </span>
              </div>
            </div>
            <div className="stream-frame">
              {frame
                ? <img src={frame} alt={`Transmisión en vivo de ${deviceId}`} />
                : (
                  <div className="stream-empty">
                    <strong>Sin señal de cámara</strong>
                    <span>Comprueba que el casco esté encendido, emparejado y en la red del sitio.</span>
                  </div>
                )}
            </div>
            {flashError && (
              <p className="form-error" style={{ padding: '0.6rem 1rem' }} role="alert">{flashError}</p>
            )}
          </section>

          <EventList events={events} />
        </div>
      </main>
    </div>
  )
}
