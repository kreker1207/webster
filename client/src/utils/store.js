import { configureStore } from '@reduxjs/toolkit'
import { registerReducer } from './registerSlice'
import { authReducer } from './authSlice'
import { canvasReducer } from './canvasSlice'

const store = configureStore({
    reducer: {
      auth: authReducer,
      register: registerReducer,
      canvas: canvasReducer,
    },

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export default store