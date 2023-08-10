import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: '',
    phone: '',
    countryCode: 20,
    city: '',
    country: '',
    specialities: [],
}

export const clinicSlice = createSlice({
    name: 'clinic',
    initialState,
    reducers: {
        setClinicInfo: (state, action) => {
            state.name = action.payload.name
            state.phone = action.payload.phone
            state.specialities = action.payload.specialities
            state.city = action.payload.city
            state.country = action.payload.country
        },

        clearClinic: (state, action) => {
            state.name = ''
            state.phone = ''
            state.specialities = []
            state.city = ''
            state.country = ''
        }
    }
})

const { actions, reducer } = clinicSlice

export const { setClinicInfo, clearClinic } = actions

export default reducer