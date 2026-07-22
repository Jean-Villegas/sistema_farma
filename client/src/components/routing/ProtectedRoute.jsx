import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Loading';

/**
 * Ruta protegida: solo usuarios autenticados.
 * Redirige a /login si no hay sesión.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-200 animate-pulse">
            <i className="fas fa-heartbeat text-2xl text-white" />
          </div>
          <Loading text="Cargando HealthHub..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
