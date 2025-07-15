import { configureStore } from '@reduxjs/toolkit';
// configureStore use krke store creat kiya jata hai 
import userReducer from '../Features/userSlice';
import signupReducer from '../Features/signupSlice'; // ✅ Added signupSlice import

export const store = configureStore({
  reducer: {
    user: userReducer,
    signup: signupReducer, // ✅ Added signup reducer to the store
  },
});
