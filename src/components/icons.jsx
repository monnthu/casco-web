export function HelmetMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="7" fill="#14181f" stroke="#f5b301" strokeWidth="1.25" />
      <path d="M6 25.5h24" stroke="#f5b301" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M8.2 24.2c0-6.8 4.4-12 9.8-12s9.8 5.2 9.8 12" stroke="#f5b301" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M13 13.4c1.5-1.15 3.2-1.8 5-1.8s3.5.65 5 1.8" stroke="#f5b301" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="16.1" y="9.2" width="3.8" height="3.3" rx="0.6" fill="#f5b301" />
    </svg>
  )
}

export function HelmetEmpty() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 46h48" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 43.5c0-13 9-23.5 20-23.5s20 10.5 20 23.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="29" y="14" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}
