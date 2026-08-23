export default function AlertBanner({ alert, onAcknowledge }) {
  const when = alert?.timestamp || alert?.triggered_at
  const timeLabel = when
    ? new Date(when).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : ''

  return (
    <div className="alert-critical" role="alert" aria-live="assertive">
      <div className="alert-critical-copy">
        <span className="warn-orb">!</span>
        <div>
          <h2>Caída detectada — sin confirmar</h2>
          <p>
            <span className="device-id-display">{alert?.device_id || 'Casco'}</span>
            {timeLabel ? ` · Hoy, ${timeLabel}` : ''} · Requiere confirmación del supervisor
          </p>
        </div>
      </div>
      <button type="button" className="btn btn-white" onClick={onAcknowledge}>
        Reconocer alerta
      </button>
    </div>
  )
}
