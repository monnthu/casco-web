export default function CascoLogo({ size = 36, className = '', title = 'C.A.S.C.O.' }) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      className={['casco-logo', className].filter(Boolean).join(' ')}
      alt=""
      title={title}
      draggable="false"
    />
  )
}
