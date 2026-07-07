import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicos, createMedico, updateMedico, deleteMedico } from '../features/medicos/medicosSlice';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import DataTable from './DataTable';
import Modal from './Modal';
import FormField from './FormField';
import Loading from './Loading';
import Alert from './Alert';

export default function Medicos() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.medicos);
  const [alert, setAlert] = useState(null);
  const modal = useModal();
  const form = useForm({ username: '', password: '', email: '', especialidad: '', cedula: '', telefono: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { dispatch(fetchMedicos()); }, [dispatch]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    form.setValues({ username: row.username || '', email: row.email || '', especialidad: row.especialidad || '', cedula: row.cedula || '', telefono: row.telefono || '', password: '' });
    modal.open();
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Eliminar al médico ${row.username || row.nombre}?`)) {
      try { await dispatch(deleteMedico(row.id)).unwrap(); setAlert({ message: 'Médico eliminado', type: 'success' }); } catch (e) { setAlert({ message: e, type: 'error' }); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await dispatch(updateMedico({ id: editingId, data: form.values })).unwrap(); }
      else { await dispatch(createMedico(form.values)).unwrap(); }
      setAlert({ message: editingId ? 'Médico actualizado' : 'Médico creado', type: 'success' });
      modal.close();
      form.reset();
      setEditingId(null);
      dispatch(fetchMedicos());
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const openCreate = () => { setEditingId(null); form.reset(); modal.open(); };

  const columns = [
    { key: 'username', label: 'Usuario', render: (v, r) => (
      <div>
        <p className="font-semibold text-slate-800">{v || r.nombre || '--'}</p>
        <p className="text-xs text-slate-400">{r.email || '--'}</p>
      </div>
    )},
    { key: 'especialidad', label: 'Especialidad', render: (v) => <span className="badge bg-sky-50 text-sky-600">{v || '--'}</span> },
    { key: 'cedula', label: 'Cédula' },
    { key: 'telefono', label: 'Teléfono', render: (v) => v || '--' },
  ];

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-800"><i className="fas fa-user-md text-sky-500 mr-2" />Gestión de Médicos</h2>
          <button onClick={openCreate} className="btn-primary btn-sm"><i className="fas fa-plus" /> Nuevo Médico</button>
        </div>
        {loading ? <Loading /> : (
          <DataTable columns={columns} data={list} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editingId ? 'Editar Médico' : 'Nuevo Médico'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Usuario" name="username" value={form.values.username} onChange={form.handleChange} required={!editingId} />
            <FormField label="Contraseña" name="password" type="password" value={form.values.password} onChange={form.handleChange} required={!editingId} placeholder={editingId ? 'Dejar vacío para no cambiar' : ''} />
          </div>
          <FormField label="Email" name="email" type="email" value={form.values.email} onChange={form.handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Especialidad" name="especialidad" value={form.values.especialidad} onChange={form.handleChange} required />
            <FormField label="Cédula" name="cedula" value={form.values.cedula} onChange={form.handleChange} required />
          </div>
          <FormField label="Teléfono" name="telefono" value={form.values.telefono} onChange={form.handleChange} />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={modal.close} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><i className="fas fa-save" /> {editingId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
