export default function EventList({ events }) {
    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Eventos registrados</h3>
            {events.length === 0
                ? <p style={styles.empty}>Sin eventos.</p>
                : events.map((e, i) => (
                    <div key={i} style={styles.item}>
                        <span style={styles.dot} />
                        <div>
                            <p style={styles.type}>{e.event_type || e.event || 'fall'}</p>
                            <p style={styles.time}>
                                {e.triggered_at
                                    ? new Date(e.triggered_at).toLocaleString()
                                    : 'Ahora'}
                            </p>
                            {e.clip_filename &&
                                <a style={styles.clip}
                                   href={`http://localhost:3000/uploads/${e.clip_filename}`}
                                   target="_blank" rel="noreferrer">
                                    Ver clip
                                </a>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

const styles = {
    container: {
        background:'#1a1d27', borderRadius:'12px',
        padding:'1.5rem', flex:'1', minWidth:'280px'
    },
    title: { color:'#fff', margin:'0 0 1rem' },
    empty: { color:'#555' },
    item:  { display:'flex', gap:'0.75rem', alignItems:'flex-start', marginBottom:'1rem' },
    dot:   {
        width:8, height:8, borderRadius:'50%',
        background:'#ef4444', marginTop:4, flexShrink:0
    },
    type: { color:'#fff', margin:0, fontWeight:'bold' },
    time: { color:'#888', margin:0, fontSize:'0.8rem' },
    clip: { color:'#f5a623', fontSize:'0.8rem' }
}