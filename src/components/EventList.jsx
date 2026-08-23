import { useState } from 'react'
import MjpegPlayer from './MjpegPlayer'
import { timeAgo } from '../format'
import { IconChevron, IconShield, IconWarn } from './icons'

export default function EventList({ events }) {
  const [expanded, setExpanded] = useState(null)

  if (!events || events.length === 0) {
    return (
      <div className="panel panel-events">
        <div className="panel-head">
          <div>
            <h2>Evidencia de caídas</h2>
            <p className="panel-hint">pre 7 s + post 7 s por evento</p>
          </div>
        </div>
        <div className="placeholder">
          <IconShield />
          <p style={{ marginTop: '0.6rem' }}><strong>Sin caídas registradas</strong></p>
          <p>Este casco no reportó eventos todavía.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel panel-events">
      <div className="panel-head">
        <div>
          <h2>Evidencia de caídas</h2>
          <p className="panel-hint">pre 7 s + post 7 s por evento</p>
        </div>
        <span className="pill">{events.length}</span>
      </div>
      <div className="event-list">
        {events.map(ev => {
          const open = expanded === ev.id
          const when = ev.triggered_at ? new Date(ev.triggered_at) : null
          return (
            <div key={ev.id} className="event-card">
              <button
                type="button"
                className="event-toggle"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : ev.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <span className={`event-ico ${open ? '' : 'muted'}`}><IconWarn size={12} /></span>
                  <span>
                    <span className="event-title">{ev.event_type || 'Caída'} — {when ? timeAgo(ev.triggered_at) : 'sin fecha'}</span>
                    <span className="event-time" style={{ display: 'block' }}>
                      {when ? when.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                    </span>
                  </span>
                </span>
                <IconChevron up={open} />
              </button>
              {open && (
                <div className="event-body">
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
