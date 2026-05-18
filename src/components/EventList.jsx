import { useEffect, useRef, useState } from 'react'

// ── Reproductor MJPEG frame a frame ──────────────────────────────────────────
// El archivo en Supabase usa boundary MIME propio del ESP32, no es un video
// estándar. Este componente lo parsea y muestra los frames como slideshow.
function MjpegPlayer({ url }) {
    const [frames,  setFrames]  = useState([])
    const [current, setCurrent] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState(null)
    const intervalRef = useRef(null)

    useEffect(() => {
        if (!url) return
        setLoading(true)
        setError(null)

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.arrayBuffer()
            })
            .then(buffer => {
                const bytes    = new Uint8Array(buffer)
                const parsed   = extractJpegFrames(bytes)
                if (parsed.length === 0) throw new Error('Sin frames')
                setFrames(parsed)
                setCurrent(0)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [url])

    // Autoplay a 10 FPS cuando hay frames
    useEffect(() => {
        if (frames.length === 0) return
        intervalRef.current = setInterval(() => {
            setCurrent(c => (c + 1) % frames.length)
        }, 100) // 100ms = 10 FPS
        return () => clearInterval(intervalRef.current)
    }, [frames])

    if (!url)     return null
    if (loading)  return <div style={s.placeholder}>Cargando clip…</div>
    if (error)    return <div style={s.placeholder}>Error: {error}</div>

    return (
        <div style={s.player}>
            <img
                src={frames[current]}
                alt={`frame ${current}`}
                style={s.frame}
            />
            <div style={s.counter}>{current + 1} / {frames.length}</div>
        </div>
    )
}

// Extrae frames JPEG de un buffer MJPEG con boundary MIME
function extractJpegFrames(bytes) {
    const frames = []
    // Marcador SOI de JPEG: 0xFF 0xD8
    // Marcador EOI de JPEG: 0xFF 0xD9
    let i = 0
    while (i < bytes.length - 1) {
        // Buscar inicio de JPEG
        if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8) {
            const start = i
            // Buscar fin de JPEG
            let j = i + 2
            while (j < bytes.length - 1) {
                if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
                    const end   = j + 2
                    const slice = bytes.slice(start, end)
                    const blob  = new Blob([slice], { type: 'image/jpeg' })
                    frames.push(URL.createObjectURL(blob))
                    i = end
                    break
                }
                j++
            }
            if (j >= bytes.length - 1) break // no se encontró EOI
        } else {
            i++
        }
    }
    return frames
}

// ── Formatear fecha ───────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60)  return `hace ${s}s`
    const m = Math.floor(s / 60)
    if (m < 60)  return `hace ${m}min`
    const h = Math.floor(m / 60)
    if (h < 24)  return `hace ${h}h`
    return new Date(dateStr).toLocaleDateString()
}

// ── EventList ─────────────────────────────────────────────────────────────────
export default function EventList({ events }) {
    const [expanded, setExpanded] = useState(null)

    if (!events || events.length === 0) {
        return (
            <div style={s.empty}>
                Sin eventos registrados
            </div>
        )
    }

    return (
        <div style={s.list}>
            <h3 style={s.title}>Eventos ({events.length})</h3>
            {events.map(ev => (
                <div key={ev.id} style={s.card}>
                    <div
                        style={s.cardHeader}
                        onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
                    >
                        <div style={s.cardLeft}>
                            <span style={s.badge}>⚠ {ev.event_type || 'fall'}</span>
                            <span style={s.time}>{timeAgo(ev.triggered_at)}</span>
                        </div>
                        <span style={s.chevron}>
                            {expanded === ev.id ? '▲' : '▼'}
                        </span>
                    </div>

                    {expanded === ev.id && (
                        <div style={s.cardBody}>
                            <p style={s.meta}>
                                ID: {ev.id} · {new Date(ev.triggered_at).toLocaleString()}
                            </p>
                            {ev.clip_url
                                ? <MjpegPlayer url={ev.clip_url} />
                                : <div style={s.noClip}>Sin clip de video</div>
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = {
    list:  { flex: 1, minWidth: '320px' },
    title: { color: '#fff', marginTop: 0 },
    empty: { color: '#555', padding: '2rem', textAlign: 'center' },

    card: {
        background: '#1a1d27', borderRadius: '10px',
        marginBottom: '0.75rem', overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0.85rem 1rem',
        cursor: 'pointer', userSelect: 'none'
    },
    cardLeft:  { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    badge: {
        background: '#4a1a1a', color: '#f5a623',
        padding: '0.2rem 0.6rem', borderRadius: '6px',
        fontSize: '0.8rem', fontWeight: 'bold'
    },
    time:    { color: '#888', fontSize: '0.85rem' },
    chevron: { color: '#555', fontSize: '0.75rem' },

    cardBody: { padding: '0 1rem 1rem' },
    meta:     { color: '#555', fontSize: '0.75rem', marginTop: 0 },

    player: { position: 'relative', background: '#000', borderRadius: '8px', overflow: 'hidden' },
    frame:  { width: '100%', display: 'block' },
    counter: {
        position: 'absolute', bottom: '0.5rem', right: '0.75rem',
        color: '#fff', fontSize: '0.7rem',
        background: 'rgba(0,0,0,0.5)', padding: '0.1rem 0.4rem',
        borderRadius: '4px'
    },
    placeholder: {
        color: '#555', padding: '2rem', textAlign: 'center',
        background: '#111', borderRadius: '8px', fontSize: '0.85rem'
    },
    noClip: { color: '#555', fontSize: '0.85rem', fontStyle: 'italic' },
}
