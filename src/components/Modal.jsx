import { useEffect, useRef } from 'react'
import { IconClose } from './icons'

export default function Modal({ title, children, onClose }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    const focusable = cardRef.current?.querySelector(
      'input, button, textarea, select, [href], [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()

    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !cardRef.current) return
      const nodes = [...cardRef.current.querySelectorAll(
        'input, button, textarea, select, [href], [tabindex]:not([tabindex="-1"])'
      )].filter(el => !el.disabled)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (prev instanceof HTMLElement) prev.focus()
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="sheet-handle" />
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-close" onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
