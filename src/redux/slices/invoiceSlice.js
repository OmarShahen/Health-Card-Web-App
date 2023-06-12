import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isActive: false,
    invoice: {},
    services: []
}

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setIsActive: (state, action) => {
            state.isActive = action.payload.isActive
        },
        setInvoice: (state, action) => {
            state.invoice = action.payload.invoice
        },
        addService: (state, action) => {
            state.services = [action.payload, ...state.services]
        },
        removeService: (state, action) => {
            let services = []
            let isOnce = false
            for(let i=0;i<state.services.length;i++) {
                if(state.services[i]._id === action.payload._id && isOnce === false) {
                    isOnce = true
                    continue
                }

                services.push(state.services[i])
            }

            state.services = services
        },
        closeInvoice: (state, action) => {
            state.isActive = false
            state.invoice = {}
            state.services = []
        } 
    }
})

const { actions, reducer } = invoiceSlice

export const { setIsActive, setInvoice, addService, removeService, closeInvoice } = actions

export default reducer