import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    doctors: []
}

export const doctorsSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setDoctors: (state, action) => {
            state.doctors = action.payload.doctors
        }
    }
})

const { actions, reducer } = doctorsSlice

export const { setDoctors } = actions

export default reducer