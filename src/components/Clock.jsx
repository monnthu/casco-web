import { useEffect, useState } from 'react'
import { IconClock } from './icons'

export default function Clock({ className = 'clock' }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const label = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} · ${hh}:${mm}`

  return (
    <time className={className} dateTime={now.toISOString()}>
      <IconClock />
      {label}
      <span className="sr-only">{ss}</span>
    </time>
  )
}
