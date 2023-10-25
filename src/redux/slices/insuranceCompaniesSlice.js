import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    insuranceCompanies: []
}

export const insuranceCompanySlice = createSlice({
    name: 'insuranceCompany',
    initialState,
    reducers: {
        setInsuranceCompanies: (state, action) => {
            state.insuranceCompanies = action.payload.insuranceCompanies
        }
    }
})

const { actions, reducer } = insuranceCompanySlice

export const { setInsuranceCompanies } = actions

export default reducer