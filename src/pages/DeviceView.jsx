import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import API from '../api'
import AlertBanner from '../components/AlertBanner'
import EventList   from '../components/EventList'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://casco-backend.onrender.com'

export default function DeviceView() {
    const { deviceId } = useParams()
    const navigate     = useNavigate()
    const [events,   setEvents]   = useState([])
    const [alert,    setAlert]    = useState(null)
    const [wsStatus, setWsStatus] = useState('conectando…')
    const [frame,    setFrame]    = useState(null)
    const [flashOn,  setFlashOn]  = useState(false)
    const socketRef = useRef(null)

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
        socket.on('disconnect',    () => setWsStatus('desconectado'))

        socket.on('fall_alert', (data) => {
            API.get(`/events/${deviceId}`)
                .then(res => setEvents(res.data))
                .catch(() => setEvents(prev => [data, ...prev]))
            setAlert(data)
            setTimeout(() => setAlert(null), 8000)
        })

        return () => socket.disconnect()
    }, [deviceId])

    async function toggleFlash() {
        try {
            const res = await API.post(`/devices/${deviceId}/flash`)
            if (res.status === 200) setFlashOn(f => !f)
        } catch (err) {
            console.error('[FLASH] Error:', err.message)
        }
    }

    return (
        <div style={s.container}>
            <div style={s.header}>
                <button style={s.back} onClick={() => navigate('/')}>← Volver</button>
                <h2 style={s.title}>{deviceId}</h2>
                <span style={{ ...s.wsbadge, background: wsStatus === 'conectado' ? '#1a4a1a' : '#4a1a1a' }}>
                    ● {wsStatus}
                </span>
            </div>

            {alert && <AlertBanner alert={alert} />}

            <div style={s.body}>
                <div style={s.streamBox}>
                    <div style={s.streamHeader}>
                        <span style={s.label}>Stream en vivo</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={toggleFlash}
                                style={{
                                    ...s.flashBtn,
                                    background: flashOn ? '#f5a623' : '#333',
                                    color:      flashOn ? '#000'     : '#fff',
                                }}
                            >
                                {flashOn ? '⚡ Flash ON' : '⚡ Flash OFF'}
                            </button>
                            <span style={{ color: frame ? '#4caf50' : '#888', fontSize: '0.8rem' }}>
                                {frame ? '● En vivo' : '○ Sin señal'}
                            </span>
                        </div>
                    </div>
                    {frame
                        ? <img src={frame} alt="stream" style={s.stream} />
                        : <div style={s.noStream}>Sin señal de cámara</div>
                    }
                </div>

                <EventList events={events} />
            </div>
        </div>
    )
}

const s = {
    container:    { padding: '2rem', background: '#0f1117', minHeight: '100vh' },
    header:       { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
    title:        { color: '#fff', margin: 0 },
    back:         { padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer' },
    wsbadge:      { padding: '0.25rem 0.75rem', borderRadius: '20px', color: '#aaa', fontSize: '0.75rem' },
    body:         { display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' },
    streamBox:    { background: '#1a1d27', borderRadius: '12px', overflow: 'hidden', flex: '1', minWidth: '320px' },
    streamHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' },
    label:        { color: '#fff', fontWeight: 'bold' },
    flashBtn:     { padding: '0.3rem 0.75rem', borderRadius: '6px', border: 'none', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' },
    stream:       { width: '100%', display: 'block' },
    noStream:     { color: '#555', padding: '4rem', textAlign: 'center', fontSize: '0.9rem' },
}
