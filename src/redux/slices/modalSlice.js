import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
    isShowModal: false,
    isShowRenewModal: false
}


export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setIsShowModal: (state, action) => {
            state.isShowModal = action.payload
        },
        setIsShowRenewModal: (state, action) => {
            state.isShowRenewModal = action.payload
        }
    }
})

const { actions, reducer } = modalSlice

export const { setIsShowModal, setIsShowRenewModal } = actions

export default reducer