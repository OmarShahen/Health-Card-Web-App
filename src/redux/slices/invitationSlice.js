import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    numberOfInvitations: 0
}

export const invitationSlice = createSlice({
    name: 'invitation',
    initialState,
    reducers: {
        setNumberOfInvitations: (state, action) => {
            state.numberOfInvitations = action.payload
        }
    }
})

const { actions, reducer } = invitationSlice

export const { setNumberOfInvitations } = actions

export default reducer