import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchForos, createForo, deleteForo, addComentario, deleteComentario, fetchForo } from '../features/foros/forosSlice';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import Loading from './Loading';
import Modal from './Modal';
import Alert from './Alert';
import { formatDate, getInitials } from '../utils/constants';

function Avatar({ name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white font-bold flex items-center justify-center flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Justo ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days} d`;
  return formatDate(dateStr);
}

export default function Foros() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, loading, current } = useSelector((s) => s.foros);
  const [alert, setAlert] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const modal = useModal();
  const form = useForm({ titulo: '', contenido: '' });
  const comentForm = useForm({ comentario: '' });

  useEffect(() => { dispatch(fetchForos()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createForo(form.values)).unwrap();
      setAlert({ message: 'Publicación compartida', type: 'success' });
      form.reset();
      setComposerOpen(false);
      dispatch(fetchForos());
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta publicación?')) {
      try { await dispatch(deleteForo(id)).unwrap(); setAlert({ message: 'Publicación eliminada', type: 'success' }); } catch (err) { setAlert({ message: err, type: 'error' }); }
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
    <div className="-mx-4 -mt-2 bg-[#f0f2f5] min-h-[calc(100vh-5rem)] px-2 sm:px-4 py-4">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Composer */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          {!composerOpen ? (
            <>
              <div className="flex items-center gap-3">
                <Link to={user?.id ? `/u/${user.id}` : '/perfil'}>
                  <Avatar name={user?.username} />
                </Link>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="flex-1 text-left bg-[#f0f2f5] hover:bg-[#e4e6eb] text-slate-500 rounded-full px-4 py-2.5 text-sm"
                >
                  ¿Qué estás pensando, {user?.username}?
                </button>
              </div>
              <div className="flex border-t border-slate-100 mt-3 pt-2">
                <button type="button" onClick={() => setComposerOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-video text-red-500" /> Video en vivo
                </button>
                <button type="button" onClick={() => setComposerOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-images text-emerald-500" /> Foto/video
                </button>
                <button type="button" onClick={() => setComposerOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-smile text-amber-500" /> Sentimiento
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={user?.username} />
                <div className="flex-1 space-y-2">
                  <input
                    className="w-full text-base font-semibold outline-none placeholder:text-slate-400"
                    name="titulo"
                    placeholder="Título de tu publicación"
                    value={form.values.titulo}
                    onChange={form.handleChange}
                    required
                    autoFocus
                  />
                  <textarea
                    className="w-full text-sm outline-none resize-none placeholder:text-slate-400 min-h-[80px]"
                    name="contenido"
                    placeholder="¿Qué estás pensando?"
                    value={form.values.contenido}
                    onChange={form.handleChange}
                    required
                  />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => { setComposerOpen(false); form.reset(); }} className="text-sm font-semibold text-slate-500 px-3 py-1.5 hover:bg-slate-100 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-[#1b74e4] hover:bg-[#166fe5] text-white font-semibold text-sm px-5 py-1.5 rounded-lg disabled:opacity-50">
                  Publicar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Feed */}
        {loading && list.length === 0 ? (
          <Loading />
        ) : (
          list.map((foro) => (
            <article key={foro.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-3 flex items-start gap-3">
                <Link to={`/u/${foro.autor_id}`}>
                  <Avatar name={foro.autor_username} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/u/${foro.autor_id}`} className="font-semibold text-slate-900 hover:underline text-[15px]">
                    {foro.autor_username || 'Usuario'}
                  </Link>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    {timeAgo(foro.created_at)} · <i className="fas fa-globe-americas text-[10px]" />
                  </p>
                </div>
                {(user?.id === foro.autor_id || user?.rol === 'Administrador') && (
                  <button
                    type="button"
                    onClick={() => handleDelete(foro.id)}
                    className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center"
                    title="Eliminar"
                  >
                    <i className="fas fa-trash text-xs" />
                  </button>
                )}
              </div>

              <button type="button" onClick={() => openDetail(foro.id)} className="w-full text-left px-4 pb-3">
                <h3 className="font-semibold text-slate-900 text-[15px] mb-1">{foro.titulo}</h3>
                <p className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed line-clamp-4">{foro.contenido}</p>
              </button>

              <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-[#1b74e4] text-white flex items-center justify-center text-[8px]">
                    <i className="fas fa-thumbs-up" />
                  </span>
                  Me gusta
                </span>
                <button type="button" onClick={() => openDetail(foro.id)} className="hover:underline">
                  {foro.comentarios_count || 0} comentarios
                </button>
              </div>

              <div className="px-2 py-1 border-t border-slate-100 flex">
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-thumbs-up" /> Me gusta
                </button>
                <button type="button" onClick={() => openDetail(foro.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-comment" /> Comentar
                </button>
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                  <i className="fas fa-share-square" /> Compartir
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={current?.titulo || 'Publicación'} size="max-w-2xl">
        {current && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/u/${current.autor_id}`}>
                <Avatar name={current.autor_username} />
              </Link>
              <div>
                <Link to={`/u/${current.autor_id}`} className="font-semibold text-slate-900 hover:underline text-sm">
                  {current.autor_username}
                </Link>
                <p className="text-xs text-slate-400">{timeAgo(current.created_at)}</p>
              </div>
            </div>
            <p className="text-[15px] text-slate-800 mb-4 whitespace-pre-wrap">{current.contenido}</p>

            <div className="space-y-3 mb-4 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-sm text-slate-700">Comentarios</h4>
              {current.comentarios?.length === 0 && <p className="text-sm text-slate-400">Sé el primero en comentar</p>}
              {current.comentarios?.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Link to={`/u/${c.autor_id}`}>
                    <Avatar name={c.autor_username} size="sm" />
                  </Link>
                  <div className="flex-1 bg-[#f0f2f5] rounded-2xl px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/u/${c.autor_id}`} className="text-xs font-bold text-slate-800 hover:underline">
                        {c.autor_username || 'Usuario'}
                      </Link>
                      {(user?.id === c.autor_id || user?.rol === 'Administrador') && (
                        <button type="button" onClick={() => handleDeleteComentario(c.id)} className="text-red-400 hover:text-red-600 text-xs">
                          <i className="fas fa-trash" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-0.5">{c.comentario}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(c.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleComentar} className="flex gap-2 items-center border-t border-slate-100 pt-3">
              <Avatar name={user?.username} size="sm" />
              <input
                className="flex-1 bg-[#f0f2f5] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                name="comentario"
                placeholder="Escribe un comentario..."
                value={comentForm.values.comentario}
                onChange={comentForm.handleChange}
                required
              />
              <button type="submit" className="text-[#1b74e4] font-semibold text-sm px-2">
                <i className="fas fa-paper-plane" />
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
