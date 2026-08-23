import { Link } from 'react-router-dom'
import CascoLogo from './CascoLogo'

export default function Logo({ to = '/', subtitle = 'Consola de supervisión', compact = false }) {
  const inner = (
    <>
      <CascoLogo size={compact ? 32 : 40} />
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
