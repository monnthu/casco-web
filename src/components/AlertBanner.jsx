export default function AlertBanner({ alert, onAcknowledge }) {
  const when = alert?.timestamp || alert?.triggered_at
  const timeLabel = when
    ? new Date(when).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : ''

  return (
    <div className="alert-critical" role="alert" aria-live="assertive">
      <div>
        <h2>Caída detectada</h2>
        <p>
          {alert?.device_id || 'Casco'} · {timeLabel}
        </p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onAcknowledge}>
        Reconocer alerta
      </button>
    </div>
  )
}
