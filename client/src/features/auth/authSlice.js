import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await api.login(username, password);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await api.register(userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const data = await api.getSession();
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.logout();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = { user: null, loading: false, error: null, success: null, isAuthenticated: false, view: 'landing', initializing: true };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setView: (state, action) => { state.view = action.payload; },
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; state.success = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.user = action.payload.usuario;
        state.isAuthenticated = true;
        state.view = 'dashboard';
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.initializing = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; state.success = null; })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.view = 'landing';
        state.success = 'Cuenta creada. Ya puedes iniciar sesión.';
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        const u = action.payload;
        if (!u) {
          state.user = null;
          state.isAuthenticated = false;
          state.view = 'landing';
          return;
        }
        state.user = { id: u.id, username: u.username, rol: u.rol };
        state.isAuthenticated = true;
        state.view = 'dashboard';
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.initializing = false;
        state.user = null;
        state.isAuthenticated = false;
        state.view = 'landing';
      })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; state.view = 'landing'; });
  },
});

export const { setView, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
