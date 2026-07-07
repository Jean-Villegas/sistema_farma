import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Farmacologia from './components/Farmacologia';
import Analisis from './components/Analisis';
import Medicos from './components/Medicos';
import Foros from './components/Foros';
import PerfilSalud from './components/PerfilSalud';
import AdminPanel from './components/AdminPanel';
import Loading from './components/Loading';

const VIEWS = {
  landing: LandingPage,
  dashboard: Dashboard,
  farmacologia: Farmacologia,
  analisis: Analisis,
  medicos: Medicos,
  foros: Foros,
  perfil: PerfilSalud,
  admin: AdminPanel,
};

export default function App() {
  const { view, isAuthenticated, loading, initializing } = useAuth();

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
    return <LandingPage />;
  }

  const ViewComponent = VIEWS[view] || Dashboard;

  return (
    <Layout currentView={view}>
      <ViewComponent />
    </Layout>
  );
}
