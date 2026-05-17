import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function AddDevice() {
    const [deviceId,  setDeviceId]  = useState('')
    const [apiToken,  setApiToken]  = useState('')
    const [error,     setError]     = useState('')
    const [success,   setSuccess]   = useState(false)
    const navigate = useNavigate()

    async function handleAdd() {
        if (!deviceId || !apiToken)
            return setError('Completa todos los campos')
        try {
            await API.post('/devices/register', { device_id: deviceId, api_token: apiToken })
            setSuccess(true)
            setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar dispositivo')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Registrar dispositivo</h2>
                <p style={styles.subtitle}>
                    El Device ID y API Token deben coincidir con los configurados en el casco.
                </p>

                <input
                    style={styles.input}
                    placeholder="Device ID (ej: helmet_001)"
                    value={deviceId}
                    onChange={e => setDeviceId(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="API Token"
                    value={apiToken}
                    onChange={e => setApiToken(e.target.value)}
                />

                {error   && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>Dispositivo registrado. Redirigiendo...</p>}

                <button style={styles.button} onClick={handleAdd}>
                    Registrar
                </button>
                <button style={styles.back} onClick={() => navigate('/')}>
                    Cancelar
                </button>
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
        display:'flex', flexDirection:'column', gap:'1rem', width:'340px'
    },
    title:    { color:'#fff', margin:0, fontSize:'1.4rem' },
    subtitle: { color:'#888', margin:0, fontSize:'0.85rem' },
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
    back: {
        padding:'0.75rem', borderRadius:'8px', border:'none',
        background:'#333', color:'#fff',
        fontSize:'1rem', cursor:'pointer'
    },
    error:   { color:'#ff4d4d', margin:0 },
    success: { color:'#4caf50', margin:0 }
}