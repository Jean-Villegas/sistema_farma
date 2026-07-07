import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import Alert from './Alert';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;
const CEDULA_REGEX = /^\d{6,10}$/;

function validateRegister(values) {
  const username = values.username?.trim() || '';
  const email = values.email?.trim() || '';
  const password = values.password || '';
  const cedula = values.cedula?.trim() || '';

  if (!USERNAME_REGEX.test(username)) {
    return 'Usuario inválido: usa letras, números o guion bajo (3 a 30 caracteres, sin espacios)';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ingresa un correo electrónico válido';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (!CEDULA_REGEX.test(cedula)) {
    return 'La cédula debe tener solo números (entre 6 y 10 dígitos)';
  }
  return null;
}

export default function LandingPage() {
  const { login, register, loading, error, success, resetError, resetSuccess } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [localError, setLocalError] = useState(null);

  const loginForm = useForm({ username: '', password: '' });
  const registerForm = useForm({ username: '', password: '', email: '', cedula: '', rol: 'Cliente' });

  useEffect(() => {
    if (success) setIsRegister(false);
  }, [success]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    resetError();
    resetSuccess();
    if (!loginForm.values.username?.trim() || !loginForm.values.password) {
      setLocalError('Usuario y contraseña son obligatorios');
      return;
    }
    await login(loginForm.values.username.trim(), loginForm.values.password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError(null);
    resetError();
    resetSuccess();

    const validationError = validateRegister(registerForm.values);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    await register({
      username: registerForm.values.username.trim(),
      email: registerForm.values.email.trim().toLowerCase(),
      password: registerForm.values.password,
      cedula: registerForm.values.cedula.trim(),
      rol: registerForm.values.rol,
    });
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-200">
            <i className="fas fa-heartbeat text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Health<span className="text-sky-600">Hub</span></h1>
          <p className="text-slate-500 mt-1 text-sm">Red Social de Salud</p>
        </div>

        <div className="card p-8">
          <Alert message={displayError} type="error" onClose={() => { setLocalError(null); resetError(); }} />
          <Alert message={success} type="success" onClose={resetSuccess} />

          {!isRegister ? (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Bienvenido de nuevo</h2>
              <p className="text-sm text-slate-400 mb-6">Ingresa tus credenciales para acceder</p>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="label">Usuario</label>
                  <input className="input" name="username" placeholder="Nombre de usuario" value={loginForm.values.username} onChange={loginForm.handleChange} required autoComplete="username" />
                </div>
                <div className="mb-6">
                  <label className="label">Contraseña</label>
                  <input className="input" type="password" name="password" placeholder="••••••••" value={loginForm.values.password} onChange={loginForm.handleChange} required autoComplete="current-password" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-sign-in-alt" />}
                  Ingresar al Sistema
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <button onClick={() => { setIsRegister(true); setLocalError(null); resetError(); resetSuccess(); }} className="text-sky-600 font-semibold hover:underline">
                  Regístrate ahora
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Crear Cuenta</h2>
              <p className="text-sm text-slate-400 mb-6">Únete como paciente o médico</p>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="label">Nombre de Usuario</label>
                  <input className="input" name="username" placeholder="ej: juan_perez" value={registerForm.values.username} onChange={registerForm.handleChange} required autoComplete="username" />
                  <p className="text-xs text-slate-400 mt-1">Solo letras, números y guion bajo (3-30 caracteres)</p>
                </div>
                <div className="mb-4">
                  <label className="label">Cédula</label>
                  <input className="input" name="cedula" placeholder="Ej: 1234567890" inputMode="numeric" value={registerForm.values.cedula} onChange={registerForm.handleChange} required />
                  <p className="text-xs text-slate-400 mt-1">Solo números, entre 6 y 10 dígitos</p>
                </div>
                <div className="mb-4">
                  <label className="label">Correo Electrónico</label>
                  <input className="input" type="email" name="email" placeholder="email@ejemplo.com" value={registerForm.values.email} onChange={registerForm.handleChange} required autoComplete="email" />
                </div>
                <div className="mb-4">
                  <label className="label">Contraseña</label>
                  <input className="input" type="password" name="password" placeholder="Mínimo 6 caracteres" value={registerForm.values.password} onChange={registerForm.handleChange} required autoComplete="new-password" />
                </div>
                <div className="mb-6">
                  <label className="label">Soy un...</label>
                  <select className="input" name="rol" value={registerForm.values.rol} onChange={registerForm.handleChange}>
                    <option value="Cliente">Paciente</option>
                    <option value="Medico">Médico Especialista</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-user-plus" />}
                  Completar Registro
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-500">
                ¿Ya eres usuario?{' '}
                <button onClick={() => { setIsRegister(false); setLocalError(null); resetError(); resetSuccess(); }} className="text-sky-600 font-semibold hover:underline">
                  Inicia Sesión
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
