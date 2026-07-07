import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMedicos = createAsyncThunk('medicos/fetchAll', async (_, { rejectWithValue }) => {
  try { return await api.getMedicos(); } catch (err) { return rejectWithValue(err.message); }
});

export const createMedico = createAsyncThunk('medicos/create', async (data, { rejectWithValue }) => {
  try { return await api.createMedico(data); } catch (err) { return rejectWithValue(err.message); }
});

export const updateMedico = createAsyncThunk('medicos/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateMedico(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteMedico = createAsyncThunk('medicos/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteMedico(id); } catch (err) { return rejectWithValue(err.message); }
});

const medicosSlice = createSlice({
  name: 'medicos',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: { clearCurrentMedico: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicos.pending, (state) => { state.loading = true; })
      .addCase(fetchMedicos.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMedicos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createMedico.fulfilled, (state) => { state.loading = false; })
      .addCase(updateMedico.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteMedico.fulfilled, (state, action) => { state.list = state.list.filter(m => m.id !== action.meta.arg); });
  },
});

export const { clearCurrentMedico } = medicosSlice.actions;
export default medicosSlice.reducer;
