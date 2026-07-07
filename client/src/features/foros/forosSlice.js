import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchForos = createAsyncThunk('foros/fetchAll', async (_, { rejectWithValue }) => {
  try { return await api.getForos(); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchForo = createAsyncThunk('foros/fetchOne', async (id, { rejectWithValue }) => {
  try { return await api.getForo(id); } catch (err) { return rejectWithValue(err.message); }
});

export const createForo = createAsyncThunk('foros/create', async (data, { rejectWithValue }) => {
  try { return await api.createForo(data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteForo = createAsyncThunk('foros/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteForo(id); } catch (err) { return rejectWithValue(err.message); }
});

export const updateForo = createAsyncThunk('foros/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateForo(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const addComentario = createAsyncThunk('foros/addComentario', async ({ foroId, comentario }, { rejectWithValue }) => {
  try { return await api.addComentario(foroId, comentario); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteComentario = createAsyncThunk('foros/deleteComentario', async ({ foroId, comentarioId }, { rejectWithValue }) => {
  try { return await api.deleteComentario(foroId, comentarioId); } catch (err) { return rejectWithValue(err.message); }
});

const forosSlice = createSlice({
  name: 'foros',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: { clearCurrentForo: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForos.pending, (state) => { state.loading = true; })
      .addCase(fetchForos.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchForos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchForo.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createForo.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteForo.fulfilled, (state, action) => { state.list = state.list.filter(f => f.id !== action.meta.arg); })
      .addCase(updateForo.fulfilled, (state) => { state.loading = false; });
  },
});

export const { clearCurrentForo } = forosSlice.actions;
export default forosSlice.reducer;
