import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@routes'
import { App } from './App'
import CssBaseline from '@mui/material/CssBaseline'

createRoot(document.getElementById('root')).render(
    <StrictMode>
            <CssBaseline />
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <RouterProvider router={router} />
                </PersistGate>
            </Provider>
    </StrictMode>
)