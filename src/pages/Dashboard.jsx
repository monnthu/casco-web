import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Dashboard() {
    const [devices,  setDevices]  = useState([])
    const [loading,  setLoading]  = useState(true)
    const [deviceId, setDeviceId] = useState('')
    const [error,    setError]    = useState('')
    const [showAdd,  setShowAdd]  = useState(false)
    const navigate = useNavigate()

    useEffect(() => { loadDevices() }, [])

    async function loadDevices() {
        const res = await API.get('/devices')
        setDevices(res.data)
        setLoading(false)
    }

    async function handleAdd() {
        if (!deviceId) return setError('Ingresa un Device ID')
        try {
            await API.post('/devices/link', { device_id: deviceId.toUpperCase() })
            setShowAdd(false)
            setDeviceId('')
            setError('')
            loadDevices()
        } catch (err) {
            setError(err.response?.data?.error || 'Device ID no encontrado')
        }
    }

    async function handleDelete(id) {
        if (!confirm(`¿Eliminar ${id} de tu cuenta?`)) return
        try {
            await API.delete(`/devices/${id}`)
            loadDevices()
        } catch {
            alert('Error al eliminar')
        }
    }

    function logout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    if (loading) return (
        <div style={styles.container}>
            <p style={{ color: '#888' }}>Cargando...</p>
        </div>
    )

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>C.A.S.C.O.</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
                        + Agregar
                    </button>
                    <button style={styles.logout} onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {showAdd && (
                <div style={styles.modal}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitle}>Agregar dispositivo</h3>
                        <p style={styles.modalSub}>
                            Ingresa el Device ID que aparece en el portal del casco.
                        </p>
                        <input
                            style={styles.input}
                            placeholder="CASCO-A1B2C3"
                            value={deviceId}
                            onChange={e => {
                                setDeviceId(e.target.value.toUpperCase())
                                setError('')
                            }}
                        />
                        {error && <p style={styles.error}>{error}</p>}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button style={styles.addBtn} onClick={handleAdd}>
                                Vincular
                            </button>
                            <button style={styles.logout} onClick={() => {
                                setShowAdd(false)
                                setError('')
                                setDeviceId('')
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {devices.length === 0
                ? <p style={styles.empty}>Sin dispositivos. Agrega uno con el botón +</p>
                : <div style={styles.grid}>
                    {devices.map(d => (
                        <div key={d.device_id} style={styles.card}>
                            <div style={styles.cardTop}
                                 onClick={() => navigate(`/device/${d.device_id}`)}>
                                <span style={styles.dot} />
                                <p style={styles.deviceId}>{d.device_id}</p>
                                <p style={styles.date}>
                                    Registrado: {new Date(d.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button style={styles.deleteBtn}
                                    onClick={() => handleDelete(d.device_id)}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

const styles = {
    container: { padding: '2rem', background: '#0f1117', minHeight: '100vh' },
    header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title:     { color: '#fff', margin: 0 },
    addBtn: {
        padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
        background: '#f5a623', color: '#000', fontWeight: 'bold', cursor: 'pointer'
    },
    logout: {
        padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
        background: '#333', color: '#fff', cursor: 'pointer'
    },
    empty: { color: '#888' },
    grid:  { display: 'flex', flexWrap: 'wrap', gap: '1rem' },
    card: {
        background: '#1a1d27', borderRadius: '12px',
        border: '1px solid #2a2d3a', width: '200px',
        overflow: 'hidden'
    },
    cardTop:  { padding: '1.5rem', cursor: 'pointer' },
    dot:      { width: 10, height: 10, borderRadius: '50%', background: '#4caf50', display: 'block' },
    deviceId: { color: '#fff', fontWeight: 'bold', margin: '0.5rem 0 0' },
    date:     { color: '#888', fontSize: '0.8rem', margin: 0 },
    deleteBtn: {
        width: '100%', padding: '0.5rem', border: 'none',
        background: '#2a1a1a', color: '#ff4d4d',
        cursor: 'pointer', fontSize: '0.85rem'
    },
    modal: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 100
    },
    modalCard: {
        background: '#1a1d27', padding: '2rem', borderRadius: '12px',
        display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '320px'
    },
    modalTitle: { color: '#fff', margin: 0 },
    modalSub:   { color: '#888', margin: 0, fontSize: '0.85rem' },
    input: {
        padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #333', background: '#0f1117',
        color: '#fff', fontSize: '1rem'
    },
    error: { color: '#ff4d4d', margin: 0 }
}