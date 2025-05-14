import { createBrowserRouter, Navigate  } from 'react-router-dom'
import { Signup, Login, Calender, Schedule } from '@pages'
import { App } from '../App'
import { ProtectedRoute } from '@utils'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: (
                    <Navigate to='/calender' replace />
                )
            },
            {
                path: '/signup',
                element: (
                    <Signup />
                )
            },
            {
                path: '/login',
                element: (
                    <Login />
                )
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/calender',
                        element: (
                            <Calender />
                        )
                    },
                    {
                        path: '/schedule',
                        element: (
                            <Schedule />
                        )
                    }
                ]
            }
        ]
    }
])
