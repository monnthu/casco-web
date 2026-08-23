export function IconHat({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17.5h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 16.4c0-5.2 3.3-9.2 7-9.2s7 4 7 9.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 8.6c.9-.7 2-.1 3-1.1s2.1.4 3 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10.6" y="5.2" width="2.8" height="2.4" rx="0.4" fill="currentColor" />
    </svg>
  )
}

export function HelmetMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="7" fill="rgba(245,179,1,0.1)" stroke="rgba(245,179,1,0.4)" strokeWidth="1.25" />
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

export function IconSearch({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconLink({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 0 0 7.07 7.07L14 18.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconTrash({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 7l.8 12.2A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.8L17.5 7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function IconLogout({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12h10M11 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBack({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconClose({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconWarn({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4l9.5 16H2.5L12 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.6 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBolt({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 3L5 13h6l-1 8 8-12h-6l1-6z" fill="currentColor" />
    </svg>
  )
}

export function IconMute({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l5 4V6L7 10H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconVolume({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l5 4V6L7 10H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7.5a7 7 0 0 1 0 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconCamOff({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h10a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 10.5l5-2.5v8l-5-2.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 4l18 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconPlay({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l12-7z" />
    </svg>
  )
}

export function IconPause({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  )
}

export function IconInfo({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.5V17M12 7.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconFlask({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6L5.5 19a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 15h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconEye({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function IconEyeOff({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4l18 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.5 6.2A10 10 0 0 1 12 6c6 0 10 6 10 6a16 16 0 0 1-3.2 3.5M6.5 8.4C4.1 9.9 2 12 2 12s4 7 10 7a10 10 0 0 0 3.3-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconClock({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconShield({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function IconQuestion({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1.4 1-1.4 1.9V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconChevron({ up = false, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: up ? 'rotate(180deg)' : undefined }}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconVideo({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 10.5l5-2.5v8l-5-2.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

export function IconHistory({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12a8 8 0 1 0 2.3-5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 5v4h4M12 8v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
