import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from './Loading';
import Alert from './Alert';

/**
 * Ruta oculta exclusiva del administrador (/admin/sistema).
 * No está en el menú de navegación.
 */
export default function AdminSistema() {
  const [stats, setStats] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [users, medStats] = await Promise.all([
          api.getUsuarios(),
          api.getStats().catch(() => null),
        ]);
        if (cancelled) return;
        const list = Array.isArray(users) ? users : users?.usuarios || [];
        setUsuarios(list);
        setStats({
          totalUsuarios: list.length,
          clientes: list.filter((u) => u.rol === 'Cliente').length,
          medicos: list.filter((u) => u.rol === 'Medico').length,
          admins: list.filter((u) => u.rol === 'Administrador').length,
          medicamentos: medStats?.total ?? medStats?.count ?? '—',
        });
      } catch (err) {
        if (!cancelled) setAlert({ message: err.message || 'Error al cargar el panel', type: 'error' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loading text="Cargando panel de sistema..." />;

  return (
    <div className="space-y-6">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-1">
            <i className="fas fa-lock mr-1" /> Ruta oculta · Solo administrador
          </p>
          <h2 className="text-xl font-extrabold text-slate-800">
            <i className="fas fa-server text-slate-500 mr-2" />
            Panel de Sistema
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Vista interna de auditoría. No aparece en el menú principal.
          </p>
        </div>
        <Link to="/admin" className="btn-secondary btn-sm">
          <i className="fas fa-arrow-left" /> Volver a Admin
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
            <i className="fas fa-users" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{stats?.totalUsuarios ?? '—'}</p>
          <p className="text-xs text-slate-500 font-medium">Usuarios</p>
        </div>
        <div className="card p-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <i className="fas fa-user" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{stats?.clientes ?? '—'}</p>
          <p className="text-xs text-slate-500 font-medium">Clientes</p>
        </div>
        <div className="card p-4">
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
            <i className="fas fa-user-md" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{stats?.medicos ?? '—'}</p>
          <p className="text-xs text-slate-500 font-medium">Médicos</p>
        </div>
        <div className="card p-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <i className="fas fa-shield-alt" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{stats?.admins ?? '—'}</p>
          <p className="text-xs text-slate-500 font-medium">Admins</p>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-slate-800 mb-4">
          <i className="fas fa-list text-slate-400 mr-2" />
          Usuarios registrados
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left p-3 font-semibold text-slate-600">ID</th>
                <th className="text-left p-3 font-semibold text-slate-600">Usuario</th>
                <th className="text-left p-3 font-semibold text-slate-600">Email</th>
                <th className="text-left p-3 font-semibold text-slate-600">Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Sin usuarios</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50">
                    <td className="p-3 text-slate-500">{u.id}</td>
                    <td className="p-3 font-medium text-slate-800">{u.username}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="badge bg-sky-50 text-sky-700">{u.rol}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
