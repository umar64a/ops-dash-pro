import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      localStorage.setItem('token', 'fake-jwt-token');
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.isAuthenticated = false;
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;