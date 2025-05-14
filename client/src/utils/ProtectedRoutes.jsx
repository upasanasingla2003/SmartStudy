import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }
    return <Outlet />
}
