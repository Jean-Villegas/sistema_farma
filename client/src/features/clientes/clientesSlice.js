import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchClientes = createAsyncThunk('clientes/fetchAll', async (_, { rejectWithValue }) => {
  try { return await api.getClientes(); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchCliente = createAsyncThunk('clientes/fetchOne', async (id, { rejectWithValue }) => {
  try { return await api.getCliente(id); } catch (err) { return rejectWithValue(err.message); }
});

export const updateCliente = createAsyncThunk('clientes/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateCliente(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const createCliente = createAsyncThunk('clientes/create', async (data, { rejectWithValue }) => {
  try { return await api.createCliente(data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteCliente = createAsyncThunk('clientes/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteCliente(id); } catch (err) { return rejectWithValue(err.message); }
});

const clientesSlice = createSlice({
  name: 'clientes',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClientes.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchClientes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCliente.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(updateCliente.fulfilled, (state) => { state.loading = false; })
      .addCase(createCliente.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteCliente.fulfilled, (state, action) => { state.list = state.list.filter(c => c.id !== action.meta.arg); });
  },
});

export const { clearCurrent } = clientesSlice.actions;
export default clientesSlice.reducer;
