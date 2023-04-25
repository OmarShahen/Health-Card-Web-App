import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/userSlice'
import patientReducer from './slices/patientSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        patient: patientReducer
    }
})