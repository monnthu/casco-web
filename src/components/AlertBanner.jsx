export default function AlertBanner({ alert }) {
    return (
        <div style={styles.banner}>
            <span style={styles.icon}>⚠️</span>
            <div>
                <p style={styles.title}>¡Caída detectada!</p>
                <p style={styles.sub}>
                    Dispositivo: {alert.device_id} —{' '}
                    {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
            </div>
        </div>
    )
}

const styles = {
    banner: {
        background:'#7f1d1d', border:'1px solid #ef4444',
        borderRadius:'10px', padding:'1rem 1.5rem',
        display:'flex', alignItems:'center', gap:'1rem', marginTop:'1rem'
    },
    icon:  { fontSize:'2rem' },
    title: { color:'#fff', fontWeight:'bold', margin:0 },
    sub:   { color:'#fca5a5', margin:0, fontSize:'0.85rem' }
}