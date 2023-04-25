import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    patientUUID: ''
}

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatientUUID: (state, action) => {
            state.patientUUID = action.payload.patientUUID
        }
    }
})

const { actions, reducer } = patientSlice

export const { setPatientUUID } = actions

export default reducer