import { Link } from 'react-router-dom'
import { HelmetMark } from './icons'

export default function Logo({ to = '/', subtitle = 'Consola de supervisión' }) {
  const inner = (
    <>
      <HelmetMark />
      <span className="brand-word">
        <strong>C.A.S.C.O.</strong>
        <span>{subtitle}</span>
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
