import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPerfil = createAsyncThunk('perfil/fetch', async (clienteId, { rejectWithValue }) => {
  try { return await api.getPerfil(clienteId); } catch (err) { return rejectWithValue(err.message); }
});

export const upsertPerfil = createAsyncThunk('perfil/upsert', async ({ clienteId, data }, { rejectWithValue }) => {
  try { return await api.upsertPerfil(clienteId, data); } catch (err) { return rejectWithValue(err.message); }
});

const perfilSlice = createSlice({
  name: 'perfil',
  initialState: { data: null, loading: false, error: null },
  reducers: { clearPerfil: (state) => { state.data = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfil.pending, (state) => { state.loading = true; })
      .addCase(fetchPerfil.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchPerfil.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(upsertPerfil.fulfilled, (state) => { state.loading = false; });
  },
});

export const { clearPerfil } = perfilSlice.actions;
export default perfilSlice.reducer;
