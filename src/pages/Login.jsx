import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { Link } from 'react-router-dom'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const navigate = useNavigate()

    async function handleLogin() {
        try {
            const res = await API.post('/auth/login', { username, password })
            localStorage.setItem('token', res.data.token)
            navigate('/')
        } catch {
            setError('Credenciales incorrectas')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>C.A.S.C.O.</h2>
                <p style={styles.subtitle}>Sistema de Monitoreo</p>

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
                {error && <p style={styles.error}>{error}</p>}
                <button style={styles.button} onClick={handleLogin}>
                    Iniciar sesión
                </button>
				<Link to="/register" style={{ color:'#f5a623', textAlign:'center', fontSize:'0.9rem' }}>
    ¿No tienes cuenta? Regístrate
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
    error: { color:'#ff4d4d', margin:0 }
}