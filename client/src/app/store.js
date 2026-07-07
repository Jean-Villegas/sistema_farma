import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import clientesReducer from '../features/clientes/clientesSlice';
import medicamentosReducer from '../features/medicamentos/medicamentosSlice';
import forosReducer from '../features/foros/forosSlice';
import analisisReducer from '../features/analisis/analisisSlice';
import medicosReducer from '../features/medicos/medicosSlice';
import perfilReducer from '../features/perfil/perfilSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clientesReducer,
    medicamentos: medicamentosReducer,
    foros: forosReducer,
    analisis: analisisReducer,
    medicos: medicosReducer,
    perfil: perfilReducer,
  },
});
