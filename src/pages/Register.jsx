import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import Logo from '../components/Logo'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!username || !password) return setError('Completa todos los campos')
    if (password !== confirm) return setError('Las contraseñas no coinciden')

    setBusy(true)
    try {
      await API.post('/auth/register', { username, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar')
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
            Crea una cuenta de supervisor para vincular cascos y recibir alertas
            de caída en tiempo real.
          </p>
        </div>
        <p className="auth-disclaimer">
          Prototipo de investigación. No es un sistema de seguridad certificado.
        </p>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleRegister}>
          <Logo to={null} subtitle="Alta de supervisor" />
          <h2>Crear cuenta</h2>
          <p className="sub">Un usuario por consola de supervisión.</p>

          <div className="field">
            <label htmlFor="reg-user">Usuario</label>
            <input
              id="reg-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reg-pass">Contraseña</label>
            <input
              id="reg-pass"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-ok">Cuenta creada. Redirigiendo…</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy || success}>
            {busy ? 'Creando…' : 'Registrarse'}
          </button>
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
