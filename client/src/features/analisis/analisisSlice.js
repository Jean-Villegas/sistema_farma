import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAnalisis = createAsyncThunk('analisis/fetchAll', async (_, { rejectWithValue }) => {
  try { return await api.getAnalisis(); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAnalisisByCliente = createAsyncThunk('analisis/fetchByCliente', async (clienteId, { rejectWithValue }) => {
  try { return await api.getAnalisisByCliente(clienteId); } catch (err) { return rejectWithValue(err.message); }
});

export const createAnalisis = createAsyncThunk('analisis/create', async (data, { rejectWithValue }) => {
  try { return await api.createAnalisis(data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteAnalisis = createAsyncThunk('analisis/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteAnalisis(id); } catch (err) { return rejectWithValue(err.message); }
});

export const updateDiagnosis = createAsyncThunk('analisis/updateDiagnosis', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateDiagnosis(id, data); } catch (err) { return rejectWithValue(err.message); }
});

const analisisSlice = createSlice({
  name: 'analisis',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: { clearCurrentAnalisis: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalisis.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalisis.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAnalisis.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAnalisisByCliente.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalisisByCliente.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchAnalisisByCliente.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateDiagnosis.fulfilled, (state) => { state.loading = false; })
      .addCase(createAnalisis.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteAnalisis.fulfilled, (state, action) => { state.list = state.list.filter(a => a.id !== action.meta.arg); });
  },
});

export const { clearCurrentAnalisis } = analisisSlice.actions;
export default analisisSlice.reducer;
