import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NAV_ITEMS, getInitials } from '../utils/constants';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.rol || 'Cliente';

  const visibleNav = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavLink to="/dashboard" className="text-lg font-extrabold text-slate-800">
              Health<span className="text-sky-600">Hub.</span>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {visibleNav.map((item) => {
              const to = item.path === '/perfil' && user?.id ? `/u/${user.id}` : item.path;
              return (
                <NavLink
                  key={item.path}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive || (item.path === '/perfil' && user?.id && location.pathname === `/u/${user.id}`)
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`
                  }
                >
                  <i className={`fas ${item.icon} mr-1.5`} />
                  {item.medicoLabel && role === 'Medico' ? item.medicoLabel : item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-400 font-medium">{user?.rol}</span>
            <div className="relative group">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white text-sm font-bold flex items-center justify-center shadow-sm"
              >
                {getInitials(user?.username)}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{user?.username}</p>
                  <p className="text-xs text-slate-400">{user?.rol}</p>
                </div>
                <NavLink
                  to={user?.id ? `/u/${user.id}` : '/perfil'}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <i className="fas fa-user-edit w-4 text-slate-400" /> Mi Perfil
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt w-4" /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 scrollbar-hide">
          {visibleNav.map((item) => {
            const to = item.path === '/perfil' && user?.id ? `/u/${user.id}` : item.path;
            return (
              <NavLink
                key={item.path}
                to={to}
                className={({ isActive }) =>
                  `flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive || (item.path === '/perfil' && user?.id && location.pathname === `/u/${user.id}`)
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`
                }
              >
                <i className={`fas ${item.icon} mr-1`} />
                {item.medicoLabel && role === 'Medico' ? item.medicoLabel : item.label}
              </NavLink>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 bg-transparent">
        <Outlet />
      </main>
    </div>
  );
}
