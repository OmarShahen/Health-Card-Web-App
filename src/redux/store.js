import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/userSlice'
import patientReducer from './slices/patientSlice'
import sidebarReducer from './slices/sidebarSlice'
import invoiceReducer from './slices/invoiceSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        patient: patientReducer,
        sidebar: sidebarReducer,
        invoice: invoiceReducer
    }
})