import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

/**
 * Ruta exclusiva de administrador.
 * No aparece en el menú público; solo accesible por URL y rol Admin.
 */
export default function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
