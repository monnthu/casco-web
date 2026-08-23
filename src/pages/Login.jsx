import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await API.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-brand">
        <div>
          <p className="auth-kicker">Casco autónomo · IoT industrial</p>
          <h1>C.A.S.C.O.</h1>
          <p className="lede">
            Casco Autónomo con Sensores de Control y Observación. Consola para
            supervisión post-caída en obra e industria.
          </p>
          <ol className="auth-steps">
            <li>
              <b>01</b>
              <span>El FSM confirma caída: caída libre, impacto y quietud.</span>
            </li>
            <li>
              <b>02</b>
              <span>La cámara bloquea 7 s previos y graba 7 s posteriores.</span>
            </li>
            <li>
              <b>03</b>
              <span>La consola alerta al supervisor y muestra la evidencia.</span>
            </li>
          </ol>
        </div>
        <p className="auth-disclaimer">
          Prototipo de investigación. No es un sistema de seguridad certificado.
          El clasificador requiere más ajuste antes de un despliegue crítico.
        </p>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleLogin}>
          <Logo to={null} subtitle="Acceso de supervisión" />
          <h2>Iniciar sesión</h2>
          <p className="sub">Monitorea cascos vinculados y alertas de caída.</p>

          <div className="field">
            <label htmlFor="login-user">Usuario</label>
            <input
              id="login-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Contraseña</label>
            <input
              id="login-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar a la consola'}
          </button>
          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
