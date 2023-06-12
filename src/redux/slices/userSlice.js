import { createSlice } from "@reduxjs/toolkit"

const userSession = sessionStorage.getItem('user')

const initialState = {
    user: JSON.parse(userSession) ? JSON.parse(userSession) : { isLogged: false },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setIsLogged: (state, action) => {
            state.user.isLogged = action.payload
        }
    }
})

const { actions, reducer } = userSlice

export const { setUser, setIsLogged } = actions

export default reducer