import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm,  setConfirm]  = useState('')
    const [error,    setError]    = useState('')
    const [success,  setSuccess]  = useState(false)
    const navigate = useNavigate()

    async function handleRegister() {
        if (!username || !password)
            return setError('Completa todos los campos')
        if (password !== confirm)
            return setError('Las contraseñas no coinciden')

        try {
            await API.post('/auth/register', { username, password })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 1500)
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>C.A.S.C.O.</h2>
                <p style={styles.subtitle}>Crear cuenta</p>

                <input
                    style={styles.input}
                    placeholder="Usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                />

                {error   && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>Cuenta creada exitosamente</p>}

                <button style={styles.button} onClick={handleRegister}>
                    Registrarse
                </button>

                <Link to="/login" style={styles.link}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display:'flex', justifyContent:'center',
        alignItems:'center', height:'100vh', background:'#0f1117'
    },
    card: {
        background:'#1a1d27', padding:'2rem', borderRadius:'12px',
        display:'flex', flexDirection:'column', gap:'1rem', width:'320px'
    },
    title:    { color:'#fff', margin:0, fontSize:'1.8rem', textAlign:'center' },
    subtitle: { color:'#888', margin:0, textAlign:'center' },
    input: {
        padding:'0.75rem', borderRadius:'8px',
        border:'1px solid #333', background:'#0f1117',
        color:'#fff', fontSize:'1rem'
    },
    button: {
        padding:'0.75rem', borderRadius:'8px', border:'none',
        background:'#f5a623', color:'#000',
        fontWeight:'bold', fontSize:'1rem', cursor:'pointer'
    },
    error:   { color:'#ff4d4d', margin:0 },
    success: { color:'#4caf50', margin:0 },
    link:    { color:'#f5a623', textAlign:'center', fontSize:'0.9rem' }
}