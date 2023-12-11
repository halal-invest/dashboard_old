import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    jwt:null,
    provider: null,
    signupToken: null,
    forgotPassToken: null
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;

    },
    jwtSuccess:(state, action)=>{
        state.jwt = action.payload;
    },
    providerSuccess:(state, action)=>{
      state.provider = action.payload;
  },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) =>{
      state.isFetching = false;
      state.error = false;
      state.currentUser =null
    },
    signupSuccess: (state, action) => {
      state.signupToken= action.payload;
     },
     forgotPasswordSuccess: (state, action) => {
       state.forgotPassToken= action.payload;
      },
  },
});

export const { loginStart,loginSuccess,loginFailure ,logout,jwtSuccess,providerSuccess,signupSuccess,forgotPasswordSuccess} = userSlice.actions;
export default userSlice.reducer;