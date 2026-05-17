import { Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import DeviceView from './pages/DeviceView'
import Register from './pages/Register'

function PrivateRoute({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <PrivateRoute><Dashboard /></PrivateRoute>
            }/>
            <Route path="/device/:deviceId" element={
                <PrivateRoute><DeviceView /></PrivateRoute>
            }/>
			
			<Route path="/register" element={<Register />} />
        </Routes>
    )
}