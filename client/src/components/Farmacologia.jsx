import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicamentos, fetchCategorias, fetchStats, deleteMedicamento, createMedicamento, updateMedicamento } from '../features/medicamentos/medicamentosSlice';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { usePagination } from '../hooks/usePagination';
import DataTable from './DataTable';
import Modal from './Modal';
import FormField from './FormField';
import Loading from './Loading';
import Alert from './Alert';

export default function Farmacologia() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, categorias, stats, loading } = useSelector((s) => s.medicamentos);
  const [alert, setAlert] = useState(null);
  const modal = useModal();
  const form = useForm({ nombre: '', descripcion: '', presentacion: '', dosis: '', laboratorio: '', categoria: '', efectos_secundarios: '', contraindicaciones: '', icono: '', color: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMedicamentos());
    dispatch(fetchCategorias());
    dispatch(fetchStats());
  }, [dispatch]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    form.setValues(row);
    modal.open();
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Eliminar "${row.nombre}"?`)) {
      try { await dispatch(deleteMedicamento(row.id)).unwrap(); setAlert({ message: 'Medicamento eliminado', type: 'success' }); } catch (e) { setAlert({ message: e, type: 'error' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await dispatch(updateMedicamento({ id: editingId, data: form.values })).unwrap(); }
      else { await dispatch(createMedicamento(form.values)).unwrap(); }
      setAlert({ message: editingId ? 'Medicamento actualizado' : 'Medicamento creado', type: 'success' });
      modal.close();
      dispatch(fetchMedicamentos());
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const openCreate = () => {
    setEditingId(null);
    form.reset();
    modal.open();
  };

  const canEdit = user?.rol === 'Administrador' || user?.rol === 'Medico';

  const columns = [
    { key: 'nombre', label: 'Medicamento', render: (v, r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm" style={{ background: r.color || '#0ea5e9' }}>
          <i className={`${r.icono || 'fas fa-pills'}`} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{v}</p>
          <p className="text-xs text-slate-400">{r.laboratorio}</p>
        </div>
      </div>
    )},
    { key: 'descripcion', label: 'Descripción', render: (v) => <span className="text-slate-500 text-xs line-clamp-2">{v || '--'}</span> },
    { key: 'categoria', label: 'Categoría', render: (v) => <span className="badge bg-sky-50 text-sky-600">{v || '--'}</span> },
  ];

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-sky-600">{stats.total_medicamentos || list.length}</p>
            <p className="text-xs text-slate-400">Medicamentos</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-purple-600">{stats.total_categorias || categorias.length}</p>
            <p className="text-xs text-slate-400">Categorías</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-600">{stats.total_laboratorios || '--'}</p>
            <p className="text-xs text-slate-400">Laboratorios</p>
          </div>
        </div>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-800"><i className="fas fa-capsules text-sky-500 mr-2" />Vademécum</h2>
          {canEdit && <button onClick={openCreate} className="btn-primary btn-sm"><i className="fas fa-plus" /> Agregar</button>}
        </div>
        {loading ? <Loading /> : (
          <DataTable columns={columns} data={list} onEdit={canEdit ? handleEdit : null} onDelete={canEdit ? handleDelete : null} />
        )}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editingId ? 'Editar Medicamento' : 'Nuevo Medicamento'} size="max-w-xl">
        <form onSubmit={handleSubmit}>
          <FormField label="Nombre" name="nombre" value={form.values.nombre} onChange={form.handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Laboratorio" name="laboratorio" value={form.values.laboratorio} onChange={form.handleChange} />
            <FormField label="Categoría" name="categoria" value={form.values.categoria} onChange={form.handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Presentación" name="presentacion" value={form.values.presentacion} onChange={form.handleChange} />
            <FormField label="Dosis" name="dosis" value={form.values.dosis} onChange={form.handleChange} />
          </div>
          <FormField label="Descripción" name="descripcion" type="textarea" value={form.values.descripcion} onChange={form.handleChange} />
          <FormField label="Efectos Secundarios" name="efectos_secundarios" type="textarea" value={form.values.efectos_secundarios} onChange={form.handleChange} />
          <FormField label="Contraindicaciones" name="contraindicaciones" type="textarea" value={form.values.contraindicaciones} onChange={form.handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icono (Font Awesome)" name="icono" value={form.values.icono} onChange={form.handleChange} placeholder="fas fa-pills" />
            <FormField label="Color (hex)" name="color" value={form.values.color} onChange={form.handleChange} placeholder="#0ea5e9" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={modal.close} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><i className="fas fa-save" /> Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
