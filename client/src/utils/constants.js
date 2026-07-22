export const ROLES = { CLIENTE: 'Cliente', MEDICO: 'Medico', ADMIN: 'Administrador' };

export const TIPOS_ANALISIS = ['Sangre de rutina', 'Sangre Completa', 'Perfil Lipídico', 'Orina', 'Heces', 'Otro'];

export const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const COLORES_PIEL = ['blanco', 'moreno_claro', 'moreno_medio', 'moreno_oscuro', 'negro'];

export const TIPOS_POST = ['diagnostico', 'tratamiento', 'receta', 'nota'];

/** Ítems visibles en el menú. Las rutas ocultas de admin no van aquí. */
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Inicio', icon: 'fa-home' },
  { path: '/farmacologia', label: 'Farmacología', icon: 'fa-capsules' },
  { path: '/analisis', label: 'Mis Análisis', icon: 'fa-flask', medicoLabel: 'Análisis Pacientes' },
  { path: '/medicos', label: 'Médicos', icon: 'fa-user-md', roles: ['Administrador'] },
  { path: '/foros', label: 'Comunidad', icon: 'fa-comments' },
  { path: '/chat', label: 'Chat', icon: 'fa-comment-dots' },
  { path: '/perfil', label: 'Mi Perfil', icon: 'fa-user-edit' },
  { path: '/admin', label: 'Admin', icon: 'fa-shield-alt', roles: ['Administrador'] },
];

/** Rutas ocultas exclusivas del administrador (no aparecen en NAV_ITEMS). */
export const ADMIN_HIDDEN_ROUTES = [
  { path: '/admin/sistema', label: 'Panel de Sistema' },
];

export function getInitials(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

export function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}
