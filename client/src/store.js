import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { authSlice, scheduleSlice, revisionSlice } from '@redux'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [scheduleSlice, revisionSlice]
}

const rootReducer = combineReducers({auth: authSlice.reducer, schedule: scheduleSlice.reducer, revision: revisionSlice.reducer})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
})

export const persistor = persistStore(store)
