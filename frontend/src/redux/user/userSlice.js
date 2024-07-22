import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    token: null,
    error: false,
    loading: false
}

const userSlice = createSlice({name: 'user' , initialState , 
    reducers:{
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state , action) => {
            state.currentUser = action.payload;
            state.token = action.payload.token;
            state.loading = false;
            state.error = false;
        },
        signInFailed: (state , action) => {
            state.loading = false;
            state.error = action.payload
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state , action) => {
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
            
        },
        updateUserFailed: (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state ) => {
            state.loading = false;
            state.error = false;
            state.currentUser = null;
            
        },
        deleteUserFailed: (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        }
}})


export const {signInStart , signInSuccess , signInFailed , updateUserStart , updateUserSuccess , updateUserFailed , deleteUserStart , deleteUserSuccess , deleteUserFailed , signOut} = userSlice.actions;

export default userSlice.reducer; // user Reducer