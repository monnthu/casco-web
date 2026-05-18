import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import API from '../api'
import AlertBanner from '../components/AlertBanner'
import EventList   from '../components/EventList'

// ── URL del backend — nunca hardcodear localhost en producción ──
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://casco-backend.onrender.com'

export default function DeviceView() {
    const { deviceId } = useParams()
    const navigate     = useNavigate()
    const [events,    setEvents]    = useState([])
    const [alert,     setAlert]     = useState(null)
    const [streamUrl, setStreamUrl] = useState('')
    const [wsStatus,  setWsStatus]  = useState('conectando…')
    const socketRef = useRef(null)

    useEffect(() => {
        // ── Cargar eventos históricos ──
        API.get(`/events/${deviceId}`)
            .then(res => setEvents(res.data))
            .catch(err => console.error('[EVENTS] Error cargando eventos:', err))

        // ── Socket.IO — apuntar al backend real, no a localhost ──
        const socket = io(BACKEND_URL, {
            transports: ['websocket'], // evitar polling en Render free tier
            reconnectionAttempts: 5,
        })
        socketRef.current = socket

        socket.on('connect', () => {
            console.log('[WS] Conectado:', socket.id)
            setWsStatus('conectado')
            socket.emit('join_device', deviceId)
        })

        socket.on('connect_error', (err) => {
            console.error('[WS] Error de conexión:', err.message)
            setWsStatus('error')
        })

        socket.on('disconnect', () => {
            console.log('[WS] Desconectado')
            setWsStatus('desconectado')
        })

        socket.on('fall_alert', (data) => {
            console.log('[WS] fall_alert recibido:', data)
            // Fetch el evento completo desde la DB para tener clip_url
            API.get(`/events/${deviceId}`)
                .then(res => setEvents(res.data))
                .catch(() => {
                    // Fallback: agregar el data del socket directamente
                    setEvents(prev => [data, ...prev])
                })
            setAlert(data)
            setTimeout(() => setAlert(null), 8000)
        })

        // ── Stream MJPEG ──
        const camIp = localStorage.getItem(`cam_ip_${deviceId}`) || ''
        if (camIp) setStreamUrl(`http://${camIp}/stream`)

        return () => {
            socket.disconnect()
        }
    }, [deviceId])

    function setCamIp() {
        const ip = prompt('IP de la cámara (ej: 192.168.1.50):')
        if (ip) {
            localStorage.setItem(`cam_ip_${deviceId}`, ip)
            setStreamUrl(`http://${ip}/stream`)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.back} onClick={() => navigate('/')}>← Volver</button>
                <h2 style={styles.title}>{deviceId}</h2>
                <span style={{
                    ...styles.wsbadge,
                    background: wsStatus === 'conectado' ? '#1a4a1a' : '#4a1a1a'
                }}>
                    ● {wsStatus}
                </span>
            </div>

            {alert && <AlertBanner alert={alert} />}

            <div style={styles.body}>
                {/* Stream */}
                <div style={styles.streamBox}>
                    <div style={styles.streamHeader}>
                        <span style={styles.label}>Stream en vivo</span>
                        <button style={styles.ipBtn} onClick={setCamIp}>
                            Configurar IP
                        </button>
                    </div>
                    {streamUrl
                        ? <img src={streamUrl} alt="stream"
                               style={styles.stream}
                               onError={() => setStreamUrl('')} />
                        : <div style={styles.noStream}>
                            Sin stream — configura la IP de la cámara
                          </div>
                    }
                </div>

                {/* Eventos */}
                <EventList events={events} />
            </div>
        </div>
    )
}

const styles = {
    container: { padding:'2rem', background:'#0f1117', minHeight:'100vh' },
    header:    { display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' },
    title:     { color:'#fff', margin:0 },
    back: {
        padding:'0.5rem 1rem', borderRadius:'8px',
        border:'none', background:'#333', color:'#fff', cursor:'pointer'
    },
    wsbadge: {
        padding:'0.25rem 0.75rem', borderRadius:'20px',
        color:'#aaa', fontSize:'0.75rem'
    },
    body: { display:'flex', gap:'2rem', marginTop:'1.5rem', flexWrap:'wrap' },
    streamBox: {
        background:'#1a1d27', borderRadius:'12px',
        overflow:'hidden', flex:'1', minWidth:'320px'
    },
    streamHeader: {
        display:'flex', justifyContent:'space-between',
        alignItems:'center', padding:'0.75rem 1rem'
    },
    label:  { color:'#fff', fontWeight:'bold' },
    ipBtn: {
        padding:'0.3rem 0.75rem', borderRadius:'6px',
        border:'none', background:'#333', color:'#fff',
        fontSize:'0.8rem', cursor:'pointer'
    },
    stream:   { width:'100%', display:'block' },
    noStream: {
        color:'#555', padding:'4rem', textAlign:'center', fontSize:'0.9rem'
    }
}
