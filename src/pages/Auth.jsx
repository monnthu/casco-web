import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'
import { IconEye, IconEyeOff, IconFlask } from '../components/icons'

export default function Auth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [howOpen, setHowOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  function switchMode(next) {
    setMode(next)
    setError('')
    setSuccess('')
    navigate(next === 'login' ? '/login' : '/register', { replace: true })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!username.trim() || !password) {
      setError('Completá usuario y contraseña.')
      return
    }
    if (mode === 'register') {
      if (password !== confirm) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }
    setBusy(true)
    try {
      if (mode === 'login') {
        const res = await API.post('/auth/login', { username, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', username)
        navigate('/')
      } else {
        await API.post('/auth/register', { username, password })
        setSuccess('Cuenta creada. Redirigiendo al inicio de sesión…')
        setTimeout(() => {
          setMode('login')
          navigate('/login', { replace: true })
        }, 1400)
      }
    } catch (err) {
      if (mode === 'login') setError('Usuario o contraseña incorrectos. Intentá de nuevo.')
      else setError(err.response?.data?.error || 'No se pudo crear la cuenta.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className={`auth-brand grid-tech ${howOpen ? 'is-open' : ''}`}>
        <div className="hazard-stripe top" />
        <div>
          <Logo to={null} />
          <button
            type="button"
            className="how-toggle"
            aria-expanded={howOpen}
            onClick={() => setHowOpen(o => !o)}
          >
            Cómo funciona
            <span aria-hidden="true">{howOpen ? '▴' : '▾'}</span>
          </button>
          <p className="auth-kicker">Cómo funciona</p>
          <h1>C.A.S.C.O.</h1>
          <p className="auth-expand">Casco Autónomo con Sensores de Control y Observación</p>
          <ol className="auth-steps">
            <li>
              <b>01</b>
              <span>El sistema detecta una caída mediante caída libre, impacto y quietud posterior.</span>
            </li>
            <li>
              <b>02</b>
              <span>La cámara bloquea un clip de evidencia de 7 s previos + 7 s posteriores al evento.</span>
            </li>
            <li>
              <b>03</b>
              <span>El supervisor recibe una alerta en tiempo real y puede actuar de inmediato.</span>
            </li>
          </ol>
        </div>
        <p className="auth-disclaimer">
          <IconFlask />
          <span>
            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Prototipo de investigación.</strong>{' '}
            92.0% sensibilidad / 92.5% especificidad en laboratorio. No es un equipo de protección personal certificado.
          </span>
        </p>
        <div className="hazard-stripe bottom" />
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="auth-tabs">
            <button type="button" className={mode === 'login' ? 'is-on' : ''} onClick={() => switchMode('login')}>
              Iniciar sesión
            </button>
            <button type="button" className={mode === 'register' ? 'is-on' : ''} onClick={() => switchMode('register')}>
              Crear cuenta
            </button>
          </div>

          <div>
            <h2>{mode === 'login' ? 'Acceso de supervisión' : 'Crear cuenta de supervisor'}</h2>
            <p className="sub">
              {mode === 'login'
                ? 'Ingresá con tu cuenta para monitorear tus cascos vinculados.'
                : 'Registrate para vincular y monitorear cascos C.A.S.C.O.'}
            </p>
          </div>

          {error && <div className="banner-error" role="alert">{error}</div>}
          {success && <div className="banner-ok">{success}</div>}

          <div className="field">
            <label htmlFor="auth-user">Usuario</label>
            <input
              id="auth-user"
              name="username"
              autoComplete="username"
              placeholder="supervisor"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="auth-pass">Contraseña</label>
            <div className="pw-wrap">
              <input
                id="auth-pass"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="field">
              <label htmlFor="auth-confirm">Confirmar contraseña</label>
              <input
                id="auth-confirm"
                name="confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repetí la contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy || Boolean(success)}>
            {busy
              ? (mode === 'login' ? 'Ingresando…' : 'Creando cuenta…')
              : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Creá una' : 'Iniciá sesión'}
            </button>
          </p>
        </form>
      </section>
    </div>
  )
}
