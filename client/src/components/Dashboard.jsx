import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { fetchForos, createForo } from '../features/foros/forosSlice';
import { fetchPerfil } from '../features/perfil/perfilSlice';
import Loading from './Loading';
import Alert from './Alert';
import { formatDate } from '../utils/constants';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list: foros, loading, error } = useSelector((s) => s.foros);
  const perfil = useSelector((s) => s.perfil.data);
  const [alert, setAlert] = useState(null);

  const foroForm = useForm({ titulo: '', contenido: '' });

  useEffect(() => {
    dispatch(fetchForos());
    if (user?.id) dispatch(fetchPerfil(user.id));
  }, [dispatch, user?.id]);

  const handleCreateForo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createForo(foroForm.values)).unwrap();
      foroForm.reset();
      setAlert({ message: 'Publicación creada exitosamente', type: 'success' });
      dispatch(fetchForos());
    } catch (err) {
      setAlert({ message: err, type: 'error' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3 space-y-4">
        <div className="card p-5">
          <h3 className="font-bold text-sm text-slate-700 mb-3"><i className="fas fa-heartbeat text-sky-500 mr-2" />Mi Perfil de Salud</h3>
          <div className="text-sm text-slate-500 space-y-1">
            <p>Peso: <span className="font-semibold text-slate-700">{perfil?.peso_kg || '--'} kg</span></p>
            <p>Altura: <span className="font-semibold text-slate-700">{perfil?.altura_cm || '--'} cm</span></p>
            <p>Sangre: <span className="font-semibold text-slate-700">{perfil?.tipo_sangre || '--'}</span></p>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-sm text-slate-700 mb-3"><i className="fas fa-lightbulb text-amber-500 mr-2" />Sugerencias</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600"><i className="fas fa-apple-alt" /></div>
            <div>
              <p className="text-sm font-bold text-slate-700">Rutina Saludable</p>
              <p className="text-xs text-slate-400">30 min de ejercicio al día</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-6 space-y-4">
        <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

        <div className="card p-5">
          <form onSubmit={handleCreateForo}>
            <input
              className="w-full border-0 bg-transparent text-base font-bold outline-none mb-2 placeholder:text-slate-300"
              name="titulo"
              placeholder="¿Qué tienes en mente hoy?"
              value={foroForm.values.titulo}
              onChange={foroForm.handleChange}
              required
            />
            <textarea
              className="w-full border-0 bg-transparent text-sm outline-none resize-none placeholder:text-slate-300"
              name="contenido"
              rows={2}
              placeholder="Comparte una duda o un consejo de salud..."
              value={foroForm.values.contenido}
              onChange={foroForm.handleChange}
              required
            />
            <hr className="border-slate-100 my-3" />
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary btn-sm">
                {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-paper-plane" />} Publicar
              </button>
            </div>
          </form>
        </div>

        {loading ? <Loading /> : foros.map((foro) => (
          <div key={foro.id} className="card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-xs"><i className="fas fa-user" /></div>
                <span className="text-xs text-sky-600 font-semibold">{foro.autor_username || 'Usuario'}</span>
              </div>
              <span className="badge bg-sky-50 text-sky-600 text-xs">{formatDate(foro.created_at)}</span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{foro.titulo}</h3>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{foro.contenido}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span><i className="fas fa-comment mr-1" />{foro.comentarios_count || 0} comentarios</span>
            </div>
          </div>
        ))}
      </main>

      <aside className="lg:col-span-3 space-y-4">
        <div className="card p-5">
          <h3 className="font-bold text-sm text-slate-700 mb-3"><i className="fas fa-flask text-purple-500 mr-2" />Respuesta del Médico</h3>
          <p className="text-xs text-slate-400">Tus resultados médicos se mostrarán aquí.</p>
          <span className="badge bg-amber-50 text-amber-600 mt-2">Pendiente</span>
        </div>
      </aside>
    </div>
  );
}
