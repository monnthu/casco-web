import { Link } from 'react-router-dom'
import { HelmetMark } from './icons'

export default function Logo({ to = '/', subtitle = 'Consola de supervisión', compact = false }) {
  const inner = (
    <>
      <HelmetMark size={compact ? 32 : 36} />
      <span className="brand-word">
        <strong>C.A.S.C.O.</strong>
        {!compact && <span>{subtitle}</span>}
      </span>
    </>
  )

  if (!to) return <span className="brand-mark">{inner}</span>
  return (
    <Link to={to} className="brand-mark">
      {inner}
    </Link>
  )
}
