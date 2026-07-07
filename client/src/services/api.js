const API_URL = '/api';

class ApiService {
  async request(endpoint, options = {}, { silentStatuses = [] } = {}) {
    try {
      const headers = { 'Content-Type': 'application/json', ...options.headers };
      const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (silentStatuses.includes(res.status)) return null;
        throw new Error(data.mensaje || 'Error en la solicitud');
      }
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión con el servidor');
      }
      throw error;
    }
  }

  // Auth
  login = (username, password) => this.request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  register = (data) => this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  getSession = () => this.request('/auth/session');
  getMe = () => this.request('/auth/me');
  logout = () => this.request('/auth/logout', { method: 'POST' });

  // Clientes
  getClientes = () => this.request('/clientes');
  getCliente = (id) => this.request(`/clientes/${id}`);
  createCliente = (data) => this.request('/clientes', { method: 'POST', body: JSON.stringify(data) });
  updateCliente = (id, data) => this.request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  deleteCliente = (id) => this.request(`/clientes/${id}`, { method: 'DELETE' });

  // Médicos
  getMedicos = () => this.request('/medicos');
  getMedico = (id) => this.request(`/medicos/${id}`);
  createMedico = (data) => this.request('/medicos', { method: 'POST', body: JSON.stringify(data) });
  updateMedico = (id, data) => this.request(`/medicos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  deleteMedico = (id) => this.request(`/medicos/${id}`, { method: 'DELETE' });

  // Medicamentos
  getMedicamentos = () => this.request('/medicamentos');
  getMedicamento = (id) => this.request(`/medicamentos/${id}`);
  createMedicamento = (data) => this.request('/medicamentos', { method: 'POST', body: JSON.stringify(data) });
  updateMedicamento = (id, data) => this.request(`/medicamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  deleteMedicamento = (id) => this.request(`/medicamentos/${id}`, { method: 'DELETE' });
  getCategorias = () => this.request('/medicamentos/categorias');
  getStats = () => this.request('/medicamentos/stats');
  getFavoritos = () => this.request('/medicamentos/favoritos/me');
  addFavorito = (id) => this.request(`/medicamentos/${id}/favorito`, { method: 'POST' });
  removeFavorito = (id) => this.request(`/medicamentos/${id}/favorito`, { method: 'DELETE' });
  checkFavorito = (id) => this.request(`/medicamentos/favoritos/check/${id}`);

  // Foros
  getForos = () => this.request('/foros');
  getForo = (id) => this.request(`/foros/${id}`);
  createForo = (data) => this.request('/foros', { method: 'POST', body: JSON.stringify(data) });
  updateForo = (id, data) => this.request(`/foros/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  deleteForo = (id) => this.request(`/foros/${id}`, { method: 'DELETE' });
  addComentario = (id, comentario) => this.request(`/foros/${id}/comentarios`, { method: 'POST', body: JSON.stringify({ comentario }) });
  deleteComentario = (foroId, comentarioId) => this.request(`/foros/${foroId}/comentarios/${comentarioId}`, { method: 'DELETE' });

  // Análisis
  getAnalisis = () => this.request('/analisis');
  getAnalisisByCliente = (clienteId) => this.request(`/analisis/cliente/${clienteId}`);
  getAnalisisById = (id) => this.request(`/analisis/${id}`);
  createAnalisis = (data) => this.request('/analisis', { method: 'POST', body: JSON.stringify(data) });
  deleteAnalisis = (id) => this.request(`/analisis/${id}`, { method: 'DELETE' });
  updateDiagnosis = (id, data) => this.request(`/analisis/${id}/diagnosis`, { method: 'PUT', body: JSON.stringify(data) });

  // Perfil Salud
  getPerfil = (clienteId) => this.request(`/perfiles-salud/${clienteId}`);
  upsertPerfil = (clienteId, data) => this.request(`/perfiles-salud/${clienteId}`, { method: 'PUT', body: JSON.stringify(data) });

  // Usuarios (admin)
  getUsuarios = () => this.request('/usuarios');
}

export default new ApiService();
