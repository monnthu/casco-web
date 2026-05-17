import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function AddDevice() {
    const [deviceId, setDeviceId] = useState('')
    const [error,    setError]    = useState('')
    const [success,  setSuccess]  = useState(false)
    const navigate = useNavigate()

    async function handleAdd() {
        if (!deviceId) return setError('Ingresa el Device ID')
        try {
            await API.post('/devices/link', { device_id: deviceId })
            setSuccess(true)
            setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setError(err.response?.data?.error || 'Device ID no encontrado')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Agregar dispositivo</h2>
                <p style={styles.subtitle}>
                    Ingresa el Device ID que aparece en el portal de configuración del casco.
                </p>

                <input
                    style={styles.input}
                    placeholder="Device ID (ej: CASCO-A1B2C3)"
                    value={deviceId}
                    onChange={e => setDeviceId(e.target.value.toUpperCase())}
                />

                {error   && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>Dispositivo vinculado. Redirigiendo...</p>}

                <button style={styles.button} onClick={handleAdd}>
                    Vincular
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