import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import API from '../api'
import AlertBanner from '../components/AlertBanner'
import EventList from '../components/EventList'
import { clockHms } from '../format'
import {
  IconBack,
  IconBolt,
  IconCamOff,
  IconCheck,
  IconFlask,
  IconHat,
  IconHistory,
  IconMute,
  IconVideo,
  IconVolume,
} from '../components/icons'

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
  const [ack, setAck] = useState(null)
  const [wsStatus, setWsStatus] = useState('conectando')
  const [frame, setFrame] = useState(null)
  const [flashOn, setFlashOn] = useState(false)
  const [flashError, setFlashError] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  const [mobileTab, setMobileTab] = useState('live')
  const [now, setNow] = useState(() => new Date())
  const socketRef = useRef(null)
  const soundOnRef = useRef(false)
  const username = localStorage.getItem('username') || 'Supervisor'

  useEffect(() => { soundOnRef.current = soundOn }, [soundOn])
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

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
      setAck(null)
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
      setFlashError('No se pudo activar el flash. Verificá la conexión del casco.')
      console.error('[FLASH] Error:', err.message)
    }
  }

  function acknowledge() {
    setAlert(null)
    setAck({ at: new Date(), by: username })
  }

  const live = Boolean(frame)
  const wsOk = wsStatus === 'conectado'
  const wsLabel = wsStatus === 'conectado' ? 'Conectado' : wsStatus === 'conectando' ? 'Conectando' : wsStatus === 'error' ? 'Error' : 'Desconectado'

  return (
    <div className="shell grid-tech">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="topbar">
        <div className="topbar-left">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            <IconBack /> <span className="hide-sm">Flota</span>
          </button>
          <span className="rule" />
          <span style={{ color: 'var(--amber)', display: 'inline-flex' }}><IconHat /></span>
          <span className="device-id-display">{deviceId}</span>
        </div>
        <div className="topbar-right">
          <span className={`pill ${wsOk ? 'pill-ok' : 'pill-bad'}`}>
            <span className="pill-dot" />
            {wsLabel}
          </span>
          <button
            type="button"
            className={`btn btn-ghost btn-sm sound-btn hide-sm ${soundOn ? 'is-on' : ''}`}
            aria-pressed={soundOn}
            onClick={() => setSoundOn(v => !v)}
          >
            {soundOn ? <IconVolume /> : <IconMute />}
            Alerta sonora: {soundOn ? 'activada' : 'desactivada'}
          </button>
        </div>
      </header>

      <main id="contenido" className="page">
        {alert && <AlertBanner alert={alert} onAcknowledge={acknowledge} />}
        {ack && !alert && (
          <div className="ack-banner">
            <IconCheck />
            Alerta reconocida por <strong>{ack.by}</strong> a las{' '}
            <span className="device-id-display">{clockHms(ack.at)}</span>.
          </div>
        )}

        <div className="console-tabs">
          <button type="button" className={mobileTab === 'live' ? 'is-on' : ''} onClick={() => setMobileTab('live')}>
            <IconVideo /> En vivo
          </button>
          <button type="button" className={mobileTab === 'events' ? 'is-on' : ''} onClick={() => setMobileTab('events')}>
            <IconHistory /> Evidencia
            {events.length > 0 && <span className="tab-count">{events.length}</span>}
          </button>
        </div>

        <div className="console-grid" data-tab={mobileTab}>
          <section className="panel panel-live">
            <div className="panel-head">
              <div>
                <h2>
                  <span className={`pill-dot ${live ? '' : ''}`} style={{ background: live ? 'var(--live)' : 'var(--muted)' }} />
                  En vivo
                </h2>
                <p className="panel-hint">Cámara ESP32-CAM del casco</p>
              </div>
              <button
                type="button"
                className={`btn btn-ghost btn-sm ${flashOn ? 'flash-on' : ''}`}
                onClick={toggleFlash}
                aria-pressed={flashOn}
              >
                <IconBolt /> Flash
              </button>
            </div>
            <div className="stream-frame">
              {frame
                ? (
                  <>
                    <img src={frame} alt={`Transmisión en vivo de ${deviceId}`} />
                    <span className="live-chip"><span className="pill-dot" style={{ background: 'var(--live)' }} /> En vivo</span>
                    <span className="clock-chip">{clockHms(now)}</span>
                  </>
                )
                : (
                  <div className="stream-empty">
                    <IconCamOff />
                    <strong>Sin señal de cámara</strong>
                    <span>Verificá que el casco esté encendido, emparejado y conectado al Wi-Fi del sitio.</span>
                  </div>
                )}
            </div>
            {flashError && (
              <div className="banner-error" style={{ margin: 0, borderRadius: 0, border: 0, borderTop: '1px solid var(--hairline)' }} role="alert">
                {flashError}
              </div>
            )}
          </section>

          <EventList events={events} />
        </div>

        <button
          type="button"
          className={`btn btn-ghost sound-full ${soundOn ? 'is-on sound-btn' : ''}`}
          style={{ marginTop: '1rem' }}
          aria-pressed={soundOn}
          onClick={() => setSoundOn(v => !v)}
        >
          {soundOn ? <IconVolume /> : <IconMute />}
          Alerta sonora: {soundOn ? 'activada' : 'desactivada'}
        </button>

        <div className="footnote">
          <IconFlask />
          <p>
            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Prototipo de investigación.</strong>{' '}
            Clasificador validado en laboratorio (92.0% sensibilidad / 92.5% especificidad). No reemplaza protocolos de seguridad ni constituye un EPP certificado.
          </p>
        </div>
      </main>
    </div>
  )
}
