import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Dashboard() {
    const [devices, setDevices] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        API.get('/devices').then(res => setDevices(res.data))
    }, [])

    function logout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>C.A.S.C.O. — Mis dispositivos</h2>
                <button style={styles.logout} onClick={logout}>Cerrar sesión</button>
				<button style={styles.addBtn} onClick={() => navigate('/add-device')}>
    + Agregar dispositivo
</button>
            </div>

            {devices.length === 0
                ? <p style={styles.empty}>Sin dispositivos registrados.</p>
                : <div style={styles.grid}>
                    {devices.map(d => (
                        <div key={d.device_id} style={styles.card}
                             onClick={() => navigate(`/device/${d.device_id}`)}>
                            <span style={styles.dot} />
                            <p style={styles.deviceId}>{d.device_id}</p>
                            <p style={styles.date}>
                                Registrado: {new Date(d.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

const styles = {
    container: { padding:'2rem', background:'#0f1117', minHeight:'100vh' },
    header:    { display:'flex', justifyContent:'space-between', alignItems:'center' },
    title:     { color:'#fff' },
    logout: {
        padding:'0.5rem 1rem', borderRadius:'8px', border:'none',
        background:'#333', color:'#fff', cursor:'pointer'
    },
	addBtn: {
    padding:'0.5rem 1rem', borderRadius:'8px', border:'none',
    background:'#f5a623', color:'#000',
    fontWeight:'bold', cursor:'pointer'
},
    empty: { color:'#888' },
    grid:  { display:'flex', flexWrap:'wrap', gap:'1rem', marginTop:'1.5rem' },
    card: {
        background:'#1a1d27', padding:'1.5rem', borderRadius:'12px',
        cursor:'pointer', width:'200px', border:'1px solid #2a2d3a'
    },
    dot:      { width:10, height:10, borderRadius:'50%', background:'#4caf50', display:'block' },
    deviceId: { color:'#fff', fontWeight:'bold', margin:'0.5rem 0 0' },
    date:     { color:'#888', fontSize:'0.8rem', margin:0 }
}