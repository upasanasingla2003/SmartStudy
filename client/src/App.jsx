import { Navbar } from '@components';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

export const App = () => {
  const { isAuthenticated } = useSelector((state)=> state.auth)
    return (
      <>
        {isAuthenticated && <Navbar />}
        <ToastContainer autoClose={2500} /> 
        <Outlet />
      </>
    )
}
