import { createSlice } from "@reduxjs/toolkit";

export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    user: null,
  },
  reducers: {
    signup: (state, action) => {
      state.user = action.payload; // Set the user to payload data after signup
    },
  },
});

export const { signup } = signupSlice.actions;

export const selectSignupUser = (state) => state.signup.user;

export default signupSlice.reducer;
