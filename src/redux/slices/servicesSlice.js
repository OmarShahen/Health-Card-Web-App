import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    services: []
}

export const servicesSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload.services
        }
    }
})

const { actions, reducer } = servicesSlice

export const { setServices } = actions

export default reducer