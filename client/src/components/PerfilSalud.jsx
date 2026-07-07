import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPerfil, upsertPerfil } from '../features/perfil/perfilSlice';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import FormField from './FormField';
import Alert from './Alert';
import { TIPOS_SANGRE, COLORES_PIEL } from '../utils/constants';

export default function PerfilSalud() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data, loading } = useSelector((s) => s.perfil);
  const [alert, setAlert] = useState(null);
  const isMedicoOrAdmin = user?.rol === 'Medico' || user?.rol === 'Administrador';

  const form = useForm({
    peso_kg: '', altura_cm: '', tipo_sangre: '', color_piel: '',
    alergias: '', antecedentes: '', genero: '', edad: '',
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPerfil(user.id)).then((res) => {
        if (res.payload) {
          form.setValues({
            peso_kg: res.payload.peso_kg || '',
            altura_cm: res.payload.altura_cm || '',
            tipo_sangre: res.payload.tipo_sangre || '',
            color_piel: res.payload.color_piel || '',
            alergias: res.payload.alergias || '',
            antecedentes: res.payload.antecedentes || '',
            genero: res.payload.genero || '',
            edad: res.payload.edad || '',
          });
        }
      });
    }
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(upsertPerfil({ clienteId: user.id, data: form.values })).unwrap();
      setAlert({ message: 'Perfil actualizado correctamente', type: 'success' });
      dispatch(fetchPerfil(user.id));
    } catch (err) {
      setAlert({ message: err, type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-user-circle text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Mi Perfil de Salud</h2>
            <p className="text-sm text-slate-400">Completa tus datos para un mejor seguimiento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-3">Datos Personales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FormField label="Peso (kg)" name="peso_kg" type="number" step="0.1" value={form.values.peso_kg} onChange={form.handleChange} />
            <FormField label="Altura (cm)" name="altura_cm" type="number" value={form.values.altura_cm} onChange={form.handleChange} />
            <FormField label="Tipo de Sangre" name="tipo_sangre" type="select" options={TIPOS_SANGRE} value={form.values.tipo_sangre} onChange={form.handleChange} />
            <FormField label="Color de Piel" name="color_piel" type="select" options={COLORES_PIEL} value={form.values.color_piel} onChange={form.handleChange} />
            <FormField label="Género" name="genero" type="select" options={['masculino', 'femenino', 'otro']} value={form.values.genero} onChange={form.handleChange} />
            <FormField label="Edad" name="edad" type="number" value={form.values.edad} onChange={form.handleChange} />
          </div>

          <h3 className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-3">Antecedentes</h3>
          <FormField label="Alergias" name="alergias" type="textarea" rows={2} value={form.values.alergias} onChange={form.handleChange} placeholder="Ej: Penicilina, polen, ácaros..." />
          <FormField label="Antecedentes Médicos" name="antecedentes" type="textarea" rows={2} value={form.values.antecedentes} onChange={form.handleChange} placeholder="Ej: Hipertensión, diabetes tipo 2..." />

          <div className="mt-6">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-save" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
