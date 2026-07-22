import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Farmacologia from './components/Farmacologia';
import Analisis from './components/Analisis';
import Medicos from './components/Medicos';
import Foros from './components/Foros';
import PerfilSocial from './components/PerfilSocial';
import PerfilSalud from './components/PerfilSalud';
import AdminPanel from './components/AdminPanel';
import AdminSistema from './components/AdminSistema';
import Chat from './components/Chat';
import { useAuth } from './hooks/useAuth';
import Loading from './components/Loading';

function PublicOnly({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <Loading text="Cargando HealthHub..." />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function PerfilRedirect() {
  const { user } = useAuth();
  if (!user?.id) return <Loading />;
  return <Navigate to={`/u/${user.id}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LandingPage />
            </PublicOnly>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farmacologia" element={<Farmacologia />} />
            <Route path="/analisis" element={<Analisis />} />
            <Route path="/foros" element={<Foros />} />
            <Route path="/perfil" element={<PerfilRedirect />} />
            <Route path="/perfil/salud" element={<PerfilSalud />} />
            <Route path="/u/:userId" element={<PerfilSocial />} />
            <Route path="/chat" element={<Chat />} />

            {/* Rutas exclusivas de administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* Ruta oculta: no aparece en el menú */}
              <Route path="/admin/sistema" element={<AdminSistema />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
