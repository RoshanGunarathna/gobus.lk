// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';



// Define the initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false, // Set authenticated status
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUser: (state, action) => {
      console.log(action.payload)
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loading, updateUser, failure, removeUser } = userSlice.actions;
export default userSlice.reducer;
