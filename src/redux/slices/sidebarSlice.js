import { createSlice } from "@reduxjs/toolkit"

const initialState = { isShowSidebar: true }

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setIsShowSidebar: (state, action) => {
            state.isShowSidebar = action.payload
        }
    }
})

const { actions, reducer } = sidebarSlice

export const { setIsShowSidebar } = actions

export default reducer