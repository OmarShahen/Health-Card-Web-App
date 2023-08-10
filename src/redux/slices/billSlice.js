import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

export const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        setBillPlan: (state, action) => {
            state.planName = action.payload.planName
            state.planDaysDuration = action.payload.planDaysDuration
            state.planPrice = action.payload.planPrice
        }
    }
})

const { actions, reducer } = billSlice

export const { setBillPlan } = actions

export default reducer