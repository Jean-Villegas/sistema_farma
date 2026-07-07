const MedicamentoModel = require('../models/MedicamentoModel');

const getAll = async (req) => {
  try {
    const { search, categoria } = req.query;

    let medicamentos;
    if (search) {
      medicamentos = await MedicamentoModel.search(search);
    } else if (categoria) {
      medicamentos = await MedicamentoModel.findByCategoria(categoria);
    } else {
      medicamentos = await MedicamentoModel.findAll();
    }

    return { status: 200, data: medicamentos };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al obtener los medicamentos' } };
  }
};

const getById = async (req) => {
  try {
    const { id } = req.params;
    const medicamento = await MedicamentoModel.findById(id);

    if (!medicamento) {
      return { status: 404, data: { mensaje: 'Medicamento no encontrado' } };
    }

    return { status: 200, data: medicamento };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al obtener el medicamento' } };
  }
};

const create = async (req) => {
  try {
    const { nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono, color } = req.body;

    if (!nombre) {
      return { status: 400, data: { mensaje: 'El nombre del medicamento es obligatorio' } };
    }

    const resultId = await MedicamentoModel.create({
      nombre, descripcion, presentacion, dosis, laboratorio, categoria,
      efectos_secundarios, contraindicaciones, icono, color
    });

    return { status: 201, data: { mensaje: 'Medicamento registrado correctamente', id: resultId } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al crear el medicamento' } };
  }
};

const update = async (req) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono, color } = req.body;

    if (!nombre) {
      return { status: 400, data: { mensaje: 'El nombre del medicamento es obligatorio' } };
    }

    const result = await MedicamentoModel.update(id, {
      nombre, descripcion, presentacion, dosis, laboratorio, categoria,
      efectos_secundarios, contraindicaciones, icono, color
    });

    if (!result) {
      return { status: 404, data: { mensaje: 'Medicamento no encontrado' } };
    }

    return { status: 200, data: { mensaje: 'Medicamento actualizado correctamente' } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al actualizar el medicamento' } };
  }
};

const remove = async (req) => {
  try {
    const { id } = req.params;
    const result = await MedicamentoModel.delete(id);

    if (!result) {
      return { status: 404, data: { mensaje: 'Medicamento no encontrado' } };
    }

    return { status: 200, data: { mensaje: 'Medicamento eliminado correctamente' } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al eliminar el medicamento' } };
  }
};

const getCategorias = async (req) => {
  try {
    const categorias = await MedicamentoModel.getCategorias();
    return { status: 200, data: categorias };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al obtener las categorías' } };
  }
};

const getStats = async (req) => {
  try {
    const stats = await MedicamentoModel.getStats();
    return { status: 200, data: stats };
  } catch (error) {
    console.error(error);
    return { status: 500, data: { mensaje: 'Error al obtener estadísticas' } };
  }
};

const getFavoritos = async (req) => {
  try {
    const usuarioId = req.user.id;
    const favoritos = await MedicamentoModel.getFavoritosByUser(usuarioId);
    return { status: 200, data: favoritos };
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return { status: 500, data: { mensaje: 'Error al obtener favoritos' } };
  }
};

const addFavorito = async (req) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;
    const success = await MedicamentoModel.addFavorito(usuarioId, id);
    if (success) {
      return { status: 200, data: { mensaje: 'Agregado a favoritos' } };
    }
    return { status: 400, data: { mensaje: 'No se pudo agregar a favoritos' } };
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return { status: 500, data: { mensaje: 'Error interno' } };
  }
};

const removeFavorito = async (req) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;
    const success = await MedicamentoModel.removeFavorito(usuarioId, id);
    if (success) {
      return { status: 200, data: { mensaje: 'Eliminado de favoritos' } };
    }
    return { status: 404, data: { mensaje: 'No se encontró el favorito' } };
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return { status: 500, data: { mensaje: 'Error interno' } };
  }
};

const checkFavorito = async (req) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;
    const isFav = await MedicamentoModel.isFavorito(usuarioId, id);
    return { status: 200, data: { esFavorito: isFav } };
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return { status: 500, data: { mensaje: 'Error interno' } };
  }
};

module.exports = { getAll, getById, create, update, remove, getCategorias, getStats, getFavoritos, addFavorito, removeFavorito, checkFavorito };
