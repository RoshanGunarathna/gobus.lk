import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Load user from localStorage
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('user'), // Check if user data exists
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
      const userData = action.payload;
      localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
      state.loading = false;
      state.user = userData;
      state.isAuthenticated = true;
      state.error = null;
    },
    failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeUser: (state) => {
      localStorage.removeItem('user'); // Clear user from localStorage
      state.user = null;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loading, updateUser, failure, removeUser } = userSlice.actions;
export default userSlice.reducer;
