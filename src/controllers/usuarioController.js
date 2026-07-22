const UsuarioModel = require('../models/UsuarioModel');
const ClienteModel = require('../models/ClienteModel');
const MedicoModel = require('../models/MedicoModel');
const PerfilSaludModel = require('../models/PerfilSaludModel');

// Listar todos los usuarios
const getAll = async (req) => {
  try {
    const usuarios = await UsuarioModel.findAll();
    return { status: 200, data: usuarios };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

// Obtener usuario por ID
const getById = async (req) => {
  try {
    const { id } = req.params;
    await UsuarioModel.ensureBioColumn();
    const usuario = await UsuarioModel.findById(id);

    if (!usuario) {
      return { status: 404, data: { mensaje: 'Usuario no encontrado' } };
    }

    return { status: 200, data: usuario };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

// Perfil social público (sin email ni cédula)
const getPublicProfile = async (req) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return { status: 400, data: { mensaje: 'Usuario inválido' } };
    }
    const perfil = await UsuarioModel.findPublicById(id);
    if (!perfil) {
      return { status: 404, data: { mensaje: 'Usuario no encontrado' } };
    }
    return { status: 200, data: perfil };
  } catch (error) {
    console.error('Error getPublicProfile:', error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

// Crear usuario
const create = async (req) => {
  try {
    const { username, password, email, rol } = req.body;

    if (!username || !password || !email) {
      return { status: 400, data: { mensaje: 'Todos los campos son obligatorios' } };
    }

    const existingUser = await UsuarioModel.findByUsernameOrEmail(username, email);
    if (existingUser) {
      return { status: 400, data: { mensaje: 'El usuario o email ya existe' } };
    }

    const id = await UsuarioModel.create({
      username,
      password,
      email,
      rol: rol || 'Cliente'
    });

    return { status: 201, data: { mensaje: 'Usuario creado correctamente', id } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

// Actualizar usuario
const update = async (req) => {
  try {
    const { id } = req.params;
    const { username, email, rol, cedula, nombre } = req.body;

    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return { status: 404, data: { mensaje: 'Usuario no encontrado' } };
    }

    // Actualizar datos básicos del usuario
    if (username || email) {
      await UsuarioModel.update(id, { username, email });
    }

    // Actualizar cédula/nombre en tabla relacional
    if (cedula || nombre) {
      if (usuario.rol === 'Cliente') {
        const clienteExistente = await ClienteModel.findByUsuarioId(id);
        if (clienteExistente) {
          await ClienteModel.update(id, { cedula, nombre: nombre || username });
        }
        // Si no existe registro de cliente, lo creamos
        else if (cedula) {
          await ClienteModel.create({
            usuarioId: parseInt(id),
            nombre: nombre || username,
            apellido: '',
            cedula: cedula,
            telefono: '',
            direccion: '',
            fecha_nacimiento: null,
            genero: null
          });
        }
      } else if (usuario.rol === 'Medico') {
        // Para médicos, solo actualizar cédula en la tabla medicos
        const medicoExistente = await MedicoModel.findByUsuarioId(parseInt(id));
        if (medicoExistente && cedula) {
          await MedicoModel.update(id, { cedula });
        }
      }
    }

    return { status: 200, data: { mensaje: 'Usuario actualizado correctamente' } };
  } catch (error) {
    console.error('Error en update usuario:', error);
    return { status: 500, data: { mensaje: 'Error en el servidor: ' + error.message } };
  }
};

// Eliminar usuario
const remove = async (req) => {
  try {
    const { id } = req.params;

    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return { status: 404, data: { mensaje: 'Usuario no encontrado' } };
    }

    await UsuarioModel.delete(id);
    return { status: 200, data: { mensaje: 'Usuario eliminado correctamente' } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

// Actualizar perfil social (editable por el propio usuario)
const updateSocialProfile = async (req) => {
  try {
    const usuarioId = req.user.id;
    await UsuarioModel.ensureBioColumn();

    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : undefined;
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : undefined;
    const bio = typeof req.body?.bio === 'string' ? req.body.bio.trim().slice(0, 500) : undefined;
    const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : undefined;
    const apellido = typeof req.body?.apellido === 'string' ? req.body.apellido.trim() : undefined;
    const telefono = typeof req.body?.telefono === 'string' ? req.body.telefono.trim() : undefined;
    const especialidad = typeof req.body?.especialidad === 'string' ? req.body.especialidad.trim() : undefined;

    if (username !== undefined && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return { status: 400, data: { mensaje: 'Usuario inválido (3-30 caracteres, letras/números/_)' } };
    }
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: 400, data: { mensaje: 'Email inválido' } };
    }

    if (username) {
      const byUser = await UsuarioModel.findByUsername(username);
      if (byUser && byUser.id !== usuarioId) {
        return { status: 400, data: { mensaje: 'El nombre de usuario ya está en uso' } };
      }
    }
    if (email) {
      const byEmail = await UsuarioModel.findByEmail(email);
      if (byEmail && byEmail.id !== usuarioId) {
        return { status: 400, data: { mensaje: 'El email ya está en uso' } };
      }
    }

    await UsuarioModel.update(usuarioId, {
      username,
      email,
      bio: bio !== undefined ? bio : undefined,
    });

    if (req.user.rol === 'Cliente') {
      const existente = await ClienteModel.findByUsuarioId(usuarioId);
      if (existente) {
        await ClienteModel.update(usuarioId, { nombre, apellido, telefono });
      } else if (nombre || apellido) {
        await ClienteModel.create({
          usuarioId,
          nombre: nombre || req.user.username,
          apellido: apellido || '',
          cedula: '',
          telefono: telefono || '',
          direccion: '',
          fecha_nacimiento: null,
          genero: null,
        });
      }
    } else if (req.user.rol === 'Medico') {
      const existente = await MedicoModel.findByUsuarioId(usuarioId);
      if (existente) {
        await MedicoModel.update(usuarioId, { telefono, especialidad });
      }
    }

    const perfil = await UsuarioModel.findPublicById(usuarioId);
    const privado = await UsuarioModel.findById(usuarioId);

    return {
      status: 200,
      data: {
        mensaje: 'Perfil actualizado correctamente',
        perfil,
        usuario: {
          id: privado.id,
          username: privado.username,
          rol: privado.rol,
          email: privado.email,
        },
      },
    };
  } catch (error) {
    console.error('Error updateSocialProfile:', error);
    return { status: 500, data: { mensaje: 'Error al actualizar el perfil' } };
  }
};

// Actualizar perfil completo (usuario + cliente/medico + salud)
const updateFullProfile = async (req) => {
  try {
    const usuarioId = req.user.id;
    const { 
      username, 
      email, 
      nombre, 
      cedula, 
      peso_kg, 
      altura_cm, 
      tipo_sangre,
      color_piel,
      genero,
      edad
    } = req.body;

    // 1. Actualizar Usuario
    await UsuarioModel.update(usuarioId, { username, email });

    // 2. Actualizar Cliente o Medico (Cédula/Nombre)
    if (req.user.rol === 'Cliente') {
      await ClienteModel.update(usuarioId, { nombre, cedula });
    } else if (req.user.rol === 'Medico') {
      await MedicoModel.update(usuarioId, { cedula });
    }

    // 3. Actualizar Perfil de Salud con todos los campos
    await PerfilSaludModel.upsert(usuarioId, { 
      peso_kg, 
      altura_cm, 
      tipo_sangre,
      color_piel,
      genero,
      edad
    });

    return { status: 200, data: { mensaje: 'Perfil completo actualizado correctamente' } };
  } catch (error) {
    console.error('Error en updateFullProfile:', error);
    return { status: 500, data: { mensaje: 'Error al actualizar perfil completo' } };
  }
};

// Buscar usuarios por término — búsqueda en BD (eficiente)
const search = async (req) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return { status: 400, data: { mensaje: 'Término de búsqueda requerido' } };
    }

    const usuarios = await UsuarioModel.search(q);
    return { status: 200, data: usuarios };
  } catch (error) {
    console.error('Error en search:', error);
    return { status: 500, data: { mensaje: 'Error en el servidor' } };
  }
};

module.exports = {
  getAll,
  getById,
  getPublicProfile,
  create,
  update,
  remove,
  updateFullProfile,
  updateSocialProfile,
  search,
};
