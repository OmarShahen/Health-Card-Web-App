import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/userSlice'
import patientReducer from './slices/patientSlice'
import sidebarReducer from './slices/sidebarSlice'
import invoiceReducer from './slices/invoiceSlice'
import modalReducer from './slices/modalSlice'
import clinicReducer from './slices/clinicSlice'
import invitationReducer from './slices/invitationSlice'
import billReducer from './slices/billSlice'
import langReducer from './slices/langSlice'
import servicesReducer from './slices/servicesSlice'
import doctorsReducer from './slices/doctorsSlice'
import insuranceCompaniesReducer from './slices/insuranceCompaniesSlice'
import clinicsReducer from './slices/clinicsSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        patient: patientReducer,
        sidebar: sidebarReducer,
        invoice: invoiceReducer,
        modal: modalReducer,
        clinic: clinicReducer,
        invitation: invitationReducer,
        bill: billReducer,
        lang: langReducer,
        services: servicesReducer,
        doctors: doctorsReducer,
        insuranceCompanies: insuranceCompaniesReducer,
        clinics: clinicsReducer
    }
})