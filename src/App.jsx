import { Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import DeviceView from './pages/DeviceView'
import Register from './pages/Register'
import AddDevice from './pages/AddDevice'

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
			
			<Route path="/add-device" element={
    <PrivateRoute><AddDevice /></PrivateRoute>
}/>
        </Routes>
    )
}