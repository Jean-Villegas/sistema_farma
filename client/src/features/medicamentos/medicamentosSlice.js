import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMedicamentos = createAsyncThunk('medicamentos/fetchAll', async (_, { rejectWithValue }) => {
  try { return await api.getMedicamentos(); } catch (err) { return rejectWithValue(err.message); }
});

export const createMedicamento = createAsyncThunk('medicamentos/create', async (data, { rejectWithValue }) => {
  try { return await api.createMedicamento(data); } catch (err) { return rejectWithValue(err.message); }
});

export const updateMedicamento = createAsyncThunk('medicamentos/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateMedicamento(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteMedicamento = createAsyncThunk('medicamentos/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteMedicamento(id); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchStats = createAsyncThunk('medicamentos/fetchStats', async (_, { rejectWithValue }) => {
  try { return await api.getStats(); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchCategorias = createAsyncThunk('medicamentos/fetchCategorias', async (_, { rejectWithValue }) => {
  try { return await api.getCategorias(); } catch (err) { return rejectWithValue(err.message); }
});

export const toggleFavorito = createAsyncThunk('medicamentos/toggleFavorito', async ({ id, esFavorito }, { rejectWithValue }) => {
  try {
    if (esFavorito) { await api.removeFavorito(id); return { id, esFavorito: false }; }
    else { await api.addFavorito(id); return { id, esFavorito: true }; }
  } catch (err) { return rejectWithValue(err.message); }
});

const medicamentosSlice = createSlice({
  name: 'medicamentos',
  initialState: { list: [], categorias: [], stats: null, favoritos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicamentos.pending, (state) => { state.loading = true; })
      .addCase(fetchMedicamentos.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMedicamentos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCategorias.fulfilled, (state, action) => { state.categorias = action.payload; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(createMedicamento.fulfilled, (state, action) => { if (action.payload?.id) state.list.push({ id: action.payload.id, ...action.payload }); })
      .addCase(deleteMedicamento.fulfilled, (state, action) => { state.list = state.list.filter(m => m.id !== action.meta.arg); });
  },
});

export default medicamentosSlice.reducer;
