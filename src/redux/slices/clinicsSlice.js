import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    clinics: []
}

export const clinicsSlice = createSlice({
    name: 'clinics',
    initialState,
    reducers: {
        setClinics: (state, action) => {
            state.clinics = action.payload.clinics
        }
    }
})

const { actions, reducer } = clinicsSlice

export const { setClinics } = actions

export default reducer