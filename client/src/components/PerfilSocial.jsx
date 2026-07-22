import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { setUserFromProfile } from '../features/auth/authSlice';
import { getInitials, formatDate } from '../utils/constants';
import Loading from './Loading';
import Alert from './Alert';
import FormField from './FormField';
import PerfilSalud from './PerfilSalud';

function Avatar({ name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-9 h-9 text-sm', md: 'w-10 h-10 text-sm', lg: 'w-40 h-40 text-5xl', xl: 'w-44 h-44 text-5xl' };
  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white font-bold flex items-center justify-center shadow-md ${className}`}
    >
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

export default function PerfilSocial() {
  const { userId } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const targetId = userId === 'me' || !userId ? user?.id : parseInt(userId, 10);
  const isOwn = user?.id === targetId;

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [tab, setTab] = useState('posts');
  const [editingPost, setEditingPost] = useState(null);
  const [menuPostId, setMenuPostId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const form = useForm({
    username: '',
    email: '',
    bio: '',
    nombre: '',
    apellido: '',
    telefono: '',
    especialidad: '',
  });

  const createForm = useForm({ titulo: '', contenido: '' });
  const postForm = useForm({ titulo: '', contenido: '' });

  const load = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const [p, publicaciones] = await Promise.all([
        api.getPerfilPublico(targetId),
        api.getForosByAutor(targetId),
      ]);
      setPerfil(p);
      setPosts(Array.isArray(publicaciones) ? publicaciones : []);

      if (isOwn) {
        const privado = await api.getUsuario(targetId).catch(() => null);
        form.setValues({
          username: p.username || '',
          email: privado?.email || '',
          bio: p.bio || '',
          nombre: p.nombre || '',
          apellido: p.apellido || '',
          telefono: privado?.telefono_cliente || privado?.telefono_medico || '',
          especialidad: p.especialidad || '',
        });
      }
    } catch (err) {
      setAlert({ message: err.message || 'No se pudo cargar el perfil', type: 'error' });
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [targetId, isOwn]);

  useEffect(() => {
    if (userId === 'me' && user?.id) {
      navigate(`/u/${user.id}`, { replace: true });
    }
  }, [userId, user?.id, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const data = await api.updatePerfilSocial(form.values);
      if (data.usuario) dispatch(setUserFromProfile(data.usuario));
      setAlert({ message: data.mensaje || 'Perfil actualizado', type: 'success' });
      setTab('posts');
      await load();
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.createForo(createForm.values);
      createForm.reset();
      setComposerOpen(false);
      setAlert({ message: 'Publicación compartida', type: 'success' });
      await load();
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await api.deleteForo(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setMenuPostId(null);
      setAlert({ message: 'Publicación eliminada', type: 'success' });
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    }
  };

  const startEditPost = (post) => {
    setEditingPost(post);
    setMenuPostId(null);
    postForm.setValues({ titulo: post.titulo, contenido: post.contenido });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      await api.updateForo(editingPost.id, postForm.values);
      setAlert({ message: 'Publicación actualizada', type: 'success' });
      setEditingPost(null);
      await load();
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    }
  };

  if (loading) return <Loading text="Cargando perfil..." />;
  if (!perfil) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500 mb-4">Usuario no encontrado</p>
        <Link to="/foros" className="btn-primary btn-sm">Volver a Comunidad</Link>
      </div>
    );
  }

  const displayName = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ') || perfil.username;
  const postCount = perfil.publicaciones_count ?? posts.length;

  return (
    <div className="-mx-4 -mt-6 mb-6 bg-[#f0f2f5] min-h-[calc(100vh-4rem)]">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      {/* ===== HEADER ESTILO FACEBOOK ===== */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Portada */}
          <div className="relative h-48 sm:h-72 md:h-80 rounded-b-lg overflow-hidden mx-0 sm:mx-4">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgba(255,255,255,.35) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.2) 0, transparent 35%)',
              }}
            />
            {isOwn && (
              <button
                type="button"
                onClick={() => setTab('edit')}
                className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-800 text-sm font-semibold px-3 py-2 rounded-lg shadow flex items-center gap-2"
              >
                <i className="fas fa-camera" /> Editar portada
              </button>
            )}
          </div>

          {/* Foto + nombre + botones */}
          <div className="px-4 sm:px-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 relative z-10">
              <div className="relative self-center sm:self-auto">
                <Avatar name={perfil.username} size="lg" className="!w-36 !h-36 sm:!w-44 sm:!h-44 border-4 border-white shadow-xl" />
                {isOwn && (
                  <button
                    type="button"
                    onClick={() => setTab('edit')}
                    className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center shadow"
                    title="Editar perfil"
                  >
                    <i className="fas fa-camera text-slate-700 text-sm" />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left pb-3 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{displayName}</h1>
                <p className="text-slate-500 font-medium">{postCount} {postCount === 1 ? 'publicación' : 'publicaciones'}</p>
                <p className="text-sm text-slate-400 mt-0.5">@{perfil.username} · {perfil.rol}</p>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-end gap-2 pb-4">
                {isOwn ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setTab('posts'); setComposerOpen(true); }}
                      className="bg-[#1b74e4] hover:bg-[#166fe5] text-white font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <i className="fas fa-plus" /> Agregar a historia
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('edit')}
                      className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-slate-800 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <i className="fas fa-pen" /> Editar perfil
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/chat"
                      className="bg-[#1b74e4] hover:bg-[#166fe5] text-white font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <i className="fas fa-comment" /> Mensaje
                    </Link>
                    <button
                      type="button"
                      className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-slate-800 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <i className="fas fa-user-plus" /> Seguir
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs estilo FB */}
            <div className="border-t border-slate-200 mt-2 flex gap-1 overflow-x-auto">
              {[
                { id: 'posts', label: 'Publicaciones' },
                { id: 'about', label: 'Información' },
                ...(isOwn ? [{ id: 'salud', label: 'Salud' }, { id: 'edit', label: 'Editar' }] : []),
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-4 transition-colors ${
                    tab === t.id
                      ? 'border-[#1b74e4] text-[#1b74e4]'
                      : 'border-transparent text-slate-500 hover:bg-slate-100 rounded-t-lg'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CUERPO: INTRO + MURO ===== */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {(tab === 'posts' || tab === 'about') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Columna izquierda — Intro */}
            <aside className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Introducción</h2>
                {perfil.bio ? (
                  <p className="text-sm text-slate-700 text-center whitespace-pre-wrap mb-3">{perfil.bio}</p>
                ) : (
                  <p className="text-sm text-slate-400 text-center mb-3 italic">
                    {isOwn ? 'Cuéntale a tus amigos algo sobre ti' : 'Sin biografía'}
                  </p>
                )}
                {isOwn && (
                  <button
                    type="button"
                    onClick={() => setTab('edit')}
                    className="w-full bg-[#e4e6eb] hover:bg-[#d8dadf] text-slate-800 font-semibold text-sm py-2 rounded-lg mb-3"
                  >
                    Editar biografía
                  </button>
                )}
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-briefcase w-5 text-center text-slate-400" />
                    <span>
                      {perfil.rol === 'Medico'
                        ? `Médico${perfil.especialidad ? ` · ${perfil.especialidad}` : ''}`
                        : perfil.rol === 'Administrador'
                          ? 'Administrador de HealthHub'
                          : 'Miembro de HealthHub'}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-clock w-5 text-center text-slate-400" />
                    <span>Se unió en {formatDate(perfil.created_at)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-user w-5 text-center text-slate-400" />
                    <span>@{perfil.username}</span>
                  </li>
                  {perfil.especialidad && (
                    <li className="flex items-center gap-3">
                      <i className="fas fa-stethoscope w-5 text-center text-slate-400" />
                      <span>{perfil.especialidad}</span>
                    </li>
                  )}
                </ul>
                {isOwn && (
                  <button
                    type="button"
                    onClick={() => setTab('edit')}
                    className="w-full bg-[#e4e6eb] hover:bg-[#d8dadf] text-slate-800 font-semibold text-sm py-2 rounded-lg mt-4"
                  >
                    Editar detalles
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900">Fotos</h2>
                  <span className="text-sm text-[#1b74e4] font-medium">Ver todas</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`aspect-square bg-gradient-to-br ${
                        ['from-sky-200 to-blue-300', 'from-cyan-200 to-teal-300', 'from-indigo-200 to-violet-300', 'from-blue-100 to-sky-300', 'from-teal-100 to-cyan-300', 'from-slate-200 to-blue-200'][i]
                      }`}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Columna derecha — Muro */}
            <section className="lg:col-span-7 space-y-4">
              {tab === 'about' ? (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Información</h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex gap-3"><dt className="w-28 text-slate-400">Nombre</dt><dd className="font-medium text-slate-800">{displayName}</dd></div>
                    <div className="flex gap-3"><dt className="w-28 text-slate-400">Usuario</dt><dd className="font-medium text-slate-800">@{perfil.username}</dd></div>
                    <div className="flex gap-3"><dt className="w-28 text-slate-400">Rol</dt><dd className="font-medium text-slate-800">{perfil.rol}</dd></div>
                    {perfil.especialidad && (
                      <div className="flex gap-3"><dt className="w-28 text-slate-400">Especialidad</dt><dd className="font-medium text-slate-800">{perfil.especialidad}</dd></div>
                    )}
                    <div className="flex gap-3"><dt className="w-28 text-slate-400">Biografía</dt><dd className="text-slate-700 whitespace-pre-wrap">{perfil.bio || '—'}</dd></div>
                    <div className="flex gap-3"><dt className="w-28 text-slate-400">Miembro desde</dt><dd className="font-medium text-slate-800">{formatDate(perfil.created_at)}</dd></div>
                  </dl>
                </div>
              ) : (
                <>
                  {/* Composer estilo FB */}
                  {isOwn && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
                      {!composerOpen ? (
                        <div className="flex items-center gap-3">
                          <Avatar name={user?.username} size="md" />
                          <button
                            type="button"
                            onClick={() => setComposerOpen(true)}
                            className="flex-1 text-left bg-[#f0f2f5] hover:bg-[#e4e6eb] text-slate-500 rounded-full px-4 py-2.5 text-sm transition-colors"
                          >
                            ¿Qué estás pensando, {displayName.split(' ')[0]}?
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleCreatePost}>
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar name={user?.username} size="md" />
                            <div className="flex-1 space-y-2">
                              <input
                                className="w-full text-base font-semibold outline-none placeholder:text-slate-400"
                                name="titulo"
                                placeholder="Título de tu publicación"
                                value={createForm.values.titulo}
                                onChange={createForm.handleChange}
                                required
                                autoFocus
                              />
                              <textarea
                                className="w-full text-sm outline-none resize-none placeholder:text-slate-400 min-h-[80px]"
                                name="contenido"
                                placeholder="¿Qué estás pensando?"
                                value={createForm.values.contenido}
                                onChange={createForm.handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                            <div className="flex gap-1 text-slate-500 text-sm">
                              <span className="px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-default"><i className="fas fa-image text-emerald-500 mr-1" /> Foto</span>
                              <span className="px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-default"><i className="fas fa-smile text-amber-500 mr-1" /> Sentimiento</span>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => { setComposerOpen(false); createForm.reset(); }} className="text-sm font-semibold text-slate-500 px-3 py-1.5 hover:bg-slate-100 rounded-lg">
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={posting || !createForm.values.titulo.trim() || !createForm.values.contenido.trim()}
                                className="bg-[#1b74e4] hover:bg-[#166fe5] disabled:opacity-50 text-white font-semibold text-sm px-5 py-1.5 rounded-lg"
                              >
                                {posting ? 'Publicando...' : 'Publicar'}
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                      {!composerOpen && (
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
                      )}
                    </div>
                  )}

                  {/* Feed de posts */}
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-10 text-center">
                      <i className="fas fa-newspaper text-4xl text-slate-300 mb-3" />
                      <p className="font-bold text-slate-700">Aún no hay publicaciones</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {isOwn ? 'Comparte algo con la comunidad' : 'Este usuario todavía no ha publicado'}
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <article key={post.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        {editingPost?.id === post.id ? (
                          <form onSubmit={handleUpdatePost} className="p-4 space-y-3">
                            <input className="input" name="titulo" value={postForm.values.titulo} onChange={postForm.handleChange} required />
                            <textarea className="input" name="contenido" rows={4} value={postForm.values.contenido} onChange={postForm.handleChange} required />
                            <div className="flex gap-2 justify-end">
                              <button type="button" className="px-4 py-2 rounded-lg bg-[#e4e6eb] text-sm font-semibold" onClick={() => setEditingPost(null)}>Cancelar</button>
                              <button type="submit" className="px-4 py-2 rounded-lg bg-[#1b74e4] text-white text-sm font-semibold">Guardar</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            {/* Header del post */}
                            <div className="p-3 flex items-start gap-3">
                              <Link to={`/u/${perfil.id}`}>
                                <Avatar name={perfil.username} size="md" />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link to={`/u/${perfil.id}`} className="font-semibold text-slate-900 hover:underline text-[15px]">
                                  {displayName}
                                </Link>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  {timeAgo(post.created_at)} · <i className="fas fa-globe-americas text-[10px]" />
                                </p>
                              </div>
                              {(isOwn || user?.rol === 'Administrador') && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setMenuPostId(menuPostId === post.id ? null : post.id)}
                                    className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center"
                                  >
                                    <i className="fas fa-ellipsis-h" />
                                  </button>
                                  {menuPostId === post.id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20">
                                      {isOwn && (
                                        <button type="button" onClick={() => startEditPost(post)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3">
                                          <i className="fas fa-pen w-4 text-slate-500" /> Editar publicación
                                        </button>
                                      )}
                                      <button type="button" onClick={() => handleDeletePost(post.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-red-600 flex items-center gap-3">
                                        <i className="fas fa-trash w-4" /> Eliminar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Contenido */}
                            <div className="px-4 pb-3">
                              <h3 className="font-semibold text-slate-900 text-[15px] mb-1">{post.titulo}</h3>
                              <p className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed">{post.contenido}</p>
                            </div>

                            {/* Stats */}
                            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                              <span className="flex items-center gap-1">
                                <span className="w-4 h-4 rounded-full bg-[#1b74e4] text-white flex items-center justify-center text-[8px]">
                                  <i className="fas fa-thumbs-up" />
                                </span>
                                Me gusta
                              </span>
                              <span>{post.comentarios_count || 0} comentarios</span>
                            </div>

                            {/* Acciones */}
                            <div className="px-2 py-1 border-t border-slate-100 flex">
                              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                                <i className="fas fa-thumbs-up" /> Me gusta
                              </button>
                              <Link
                                to="/foros"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100"
                              >
                                <i className="fas fa-comment" /> Comentar
                              </Link>
                              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100">
                                <i className="fas fa-share-square" /> Compartir
                              </button>
                            </div>
                          </>
                        )}
                      </article>
                    ))
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {tab === 'edit' && isOwn && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editar perfil</h2>
            <form onSubmit={handleSaveProfile} className="space-y-1">
              <FormField label="Usuario" name="username" value={form.values.username} onChange={form.handleChange} required />
              <FormField label="Email" name="email" type="email" value={form.values.email} onChange={form.handleChange} required />
              <FormField label="Biografía" name="bio" type="textarea" rows={4} value={form.values.bio} onChange={form.handleChange} placeholder="Cuéntale a la comunidad sobre ti..." />
              {user?.rol === 'Cliente' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nombre" name="nombre" value={form.values.nombre} onChange={form.handleChange} />
                    <FormField label="Apellido" name="apellido" value={form.values.apellido} onChange={form.handleChange} />
                  </div>
                  <FormField label="Teléfono" name="telefono" value={form.values.telefono} onChange={form.handleChange} />
                </>
              )}
              {user?.rol === 'Medico' && (
                <>
                  <FormField label="Especialidad" name="especialidad" value={form.values.especialidad} onChange={form.handleChange} />
                  <FormField label="Teléfono" name="telefono" value={form.values.telefono} onChange={form.handleChange} />
                </>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setTab('posts')} className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-slate-800 font-semibold text-sm px-4 py-2 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="bg-[#1b74e4] hover:bg-[#166fe5] text-white font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        )}

        {tab === 'salud' && isOwn && (
          <div className="max-w-3xl mx-auto">
            <PerfilSalud />
          </div>
        )}
      </div>
    </div>
  );
}
