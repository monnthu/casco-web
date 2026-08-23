import { useState } from 'react'
import MjpegPlayer from './MjpegPlayer'
import { timeAgo } from '../format'

export default function EventList({ events }) {
  const [expanded, setExpanded] = useState(null)

  if (!events || events.length === 0) {
    return (
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Evidencia de caídas</h2>
            <p className="panel-hint">Clips de 14 s (7 s previos + 7 s posteriores)</p>
          </div>
        </div>
        <div className="placeholder">Sin caídas registradas para este casco.</div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>Evidencia de caídas</h2>
          <p className="panel-hint">Clips de 14 s (7 s previos + 7 s posteriores)</p>
        </div>
        <span className="pill">{events.length}</span>
      </div>
      <div className="event-list">
        {events.map(ev => {
          const open = expanded === ev.id
          return (
            <div key={ev.id} className="event-card">
              <button
                type="button"
                className="event-toggle"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : ev.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <span className="badge-fall">{ev.event_type || 'caída'}</span>
                  <span className="event-time">{timeAgo(ev.triggered_at)}</span>
                </span>
                <span aria-hidden="true" className="event-time">{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="event-body">
                  <p className="event-meta">
                    {ev.id} · {ev.triggered_at
                      ? new Date(ev.triggered_at).toLocaleString('es')
                      : 'sin marca de tiempo'}
                  </p>
                  {ev.clip_url
                    ? <MjpegPlayer key={ev.clip_url} url={ev.clip_url} />
                    : <div className="placeholder">Sin clip de video para este evento.</div>
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
