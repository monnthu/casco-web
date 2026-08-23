import { useEffect, useRef, useState } from 'react'
import { IconInfo, IconPause, IconPlay } from './icons'

function extractJpegFrames(bytes) {
  const frames = []
  let i = 0
  while (i < bytes.length - 1) {
    if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8) {
      const start = i
      let j = i + 2
      while (j < bytes.length - 1) {
        if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
          const end = j + 2
          const slice = bytes.slice(start, end)
          const blob = new Blob([slice], { type: 'image/jpeg' })
          frames.push(URL.createObjectURL(blob))
          i = end
          break
        }
        j++
      }
      if (j >= bytes.length - 1) break
    } else {
      i++
    }
  }
  return frames
}

export default function MjpegPlayer({ url }) {
  const [frames, setFrames] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playing, setPlaying] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    const created = []

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.arrayBuffer()
      })
      .then(buffer => {
        const parsed = extractJpegFrames(new Uint8Array(buffer))
        parsed.forEach(u => created.push(u))
        if (cancelled) return
        if (parsed.length === 0) throw new Error('Sin frames JPEG en el clip')
        setFrames(parsed)
        setCurrent(0)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => {
      cancelled = true
      created.forEach(u => URL.revokeObjectURL(u))
    }
  }, [url])

  useEffect(() => {
    if (frames.length === 0 || !playing) return
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % frames.length)
    }, 100)
    return () => clearInterval(intervalRef.current)
  }, [frames, playing])

  if (!url) return null
  if (loading) return <div className="placeholder">Cargando clip MJPEG…</div>
  if (error) {
    return (
      <div className="placeholder">
        No se pudo reproducir el clip ({error}). El archivo no es un vídeo estándar:
        es un MJPEG con buffer de 7 s previos y 7 s posteriores al evento.
      </div>
    )
  }

  return (
    <div>
      <div className="player">
        <img
          src={frames[current]}
          alt={`Fotograma ${current + 1} de ${frames.length} del clip de evidencia`}
        />
        <span className="frame-chip">frame {current + 1} / {frames.length}</span>
      </div>
      <p className="event-note">
        <IconInfo size={12} />
        Clip de evidencia no estándar: 7 s antes del impacto + 7 s después, reproducido cuadro por cuadro (MJPEG), no un video MP4.
      </p>
      <div className="player-controls">
        <button
          type="button"
          className="play-btn"
          onClick={() => setPlaying(p => !p)}
          aria-pressed={playing}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(frames.length - 1, 0)}
          value={current}
          onChange={e => {
            setPlaying(false)
            setCurrent(Number(e.target.value))
          }}
          aria-label="Posición del clip"
        />
        <span className="player-fps">~10 FPS</span>
      </div>
    </div>
  )
}
