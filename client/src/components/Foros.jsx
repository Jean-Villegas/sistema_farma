import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchForos, createForo, deleteForo, addComentario, deleteComentario, fetchForo } from '../features/foros/forosSlice';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import Loading from './Loading';
import Modal from './Modal';
import Alert from './Alert';
import { formatDate } from '../utils/constants';

export default function Foros() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, loading, current } = useSelector((s) => s.foros);
  const [alert, setAlert] = useState(null);
  const modal = useModal();
  const form = useForm({ titulo: '', contenido: '' });
  const comentForm = useForm({ comentario: '' });

  useEffect(() => { dispatch(fetchForos()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createForo(form.values)).unwrap();
      setAlert({ message: 'Tema creado exitosamente', type: 'success' });
      form.reset();
      dispatch(fetchForos());
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este tema?')) {
      try { await dispatch(deleteForo(id)).unwrap(); setAlert({ message: 'Tema eliminado', type: 'success' }); } catch (err) { setAlert({ message: err, type: 'error' }); }
    }
  };

  const openDetail = async (id) => {
    await dispatch(fetchForo(id));
    comentForm.reset();
    modal.open();
  };

  const handleComentar = async (e) => {
    e.preventDefault();
    if (!current?.id) return;
    try {
      await dispatch(addComentario({ foroId: current.id, comentario: comentForm.values.comentario })).unwrap();
      setAlert({ message: 'Comentario agregado', type: 'success' });
      comentForm.reset();
      dispatch(fetchForo(current.id));
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handleDeleteComentario = async (comentarioId) => {
    if (!current?.id || !window.confirm('¿Eliminar comentario?')) return;
    try {
      await dispatch(deleteComentario({ foroId: current.id, comentarioId })).unwrap();
      dispatch(fetchForo(current.id));
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="card p-5 mb-6">
        <h2 className="text-lg font-extrabold text-slate-800 mb-4"><i className="fas fa-comments text-emerald-500 mr-2" />Crear un Tema</h2>
        <form onSubmit={handleCreate}>
          <input className="input mb-3" name="titulo" placeholder="Título del tema" value={form.values.titulo} onChange={form.handleChange} required />
          <textarea className="input mb-3" name="contenido" rows={3} placeholder="Escribe tu mensaje..." value={form.values.contenido} onChange={form.handleChange} required />
          <button type="submit" disabled={loading} className="btn-primary"><i className="fas fa-plus" /> Publicar Tema</button>
        </form>
      </div>

      <div className="space-y-3">
        {loading ? <Loading /> : list.map((foro) => (
          <div key={foro.id} className="card p-4 flex items-center justify-between animate-fade-in cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetail(foro.id)}>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{foro.titulo}</h3>
              <p className="text-sm text-slate-500 line-clamp-1 mt-1">{foro.contenido}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(foro.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400"><i className="fas fa-comment mr-1" />{foro.comentarios_count || 0}</span>
              {(user?.id === foro.autor_id || user?.rol === 'Administrador') && (
                <button onClick={(e) => { e.stopPropagation(); handleDelete(foro.id); }} className="text-red-400 hover:text-red-600 p-1"><i className="fas fa-trash text-xs" /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={current?.titulo || 'Tema'} size="max-w-2xl">
        {current && (
          <div>
            <p className="text-sm text-slate-600 mb-4">{current.contenido}</p>
            <p className="text-xs text-slate-400 mb-6">{formatDate(current.created_at)}</p>

            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-sm text-slate-700">Comentarios</h4>
              {current.comentarios?.length === 0 && <p className="text-sm text-slate-400">Sin comentarios aún</p>}
              {current.comentarios?.map((c) => (
                <div key={c.id} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-600">{c.autor_nombre || 'Usuario'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{formatDate(c.created_at)}</span>
                      {(user?.id === c.autor_id || user?.rol === 'Administrador') && (
                        <button onClick={() => handleDeleteComentario(c.id)} className="text-red-400 hover:text-red-600"><i className="fas fa-trash text-xs" /></button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{c.comentario}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleComentar} className="flex gap-2">
              <input className="input flex-1" name="comentario" placeholder="Escribe un comentario..." value={comentForm.values.comentario} onChange={comentForm.handleChange} required />
              <button type="submit" className="btn-primary btn-sm"><i className="fas fa-reply" /> Responder</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
