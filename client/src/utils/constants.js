export const ROLES = { CLIENTE: 'Cliente', MEDICO: 'Medico', ADMIN: 'Administrador' };

export const TIPOS_ANALISIS = ['Sangre de rutina', 'Sangre Completa', 'Perfil Lipídico', 'Orina', 'Heces', 'Otro'];

export const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const COLORES_PIEL = ['blanco', 'moreno_claro', 'moreno_medio', 'moreno_oscuro', 'negro'];

export const TIPOS_POST = ['diagnostico', 'tratamiento', 'receta', 'nota'];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: 'fa-home' },
  { id: 'farmacologia', label: 'Farmacología', icon: 'fa-capsules' },
  { id: 'analisis', label: 'Mis Análisis', icon: 'fa-flask', medicoLabel: 'Análisis Pacientes' },
  { id: 'medicos', label: 'Médicos', icon: 'fa-user-md', roles: ['Administrador'] },
  { id: 'foros', label: 'Comunidad', icon: 'fa-comments' },
  { id: 'perfil', label: 'Mi Perfil', icon: 'fa-user-edit' },
  { id: 'admin', label: 'Admin', icon: 'fa-shield-alt', roles: ['Administrador'] },
];

export function getInitials(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

export function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}
