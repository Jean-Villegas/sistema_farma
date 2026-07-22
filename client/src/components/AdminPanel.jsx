import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes, createCliente, deleteCliente } from '../features/clientes/clientesSlice';
import { fetchMedicos } from '../features/medicos/medicosSlice';
import { fetchMedicamentos, deleteMedicamento } from '../features/medicamentos/medicamentosSlice';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import DataTable from './DataTable';
import Loading from './Loading';
import Alert from './Alert';
import Modal from './Modal';
import FormField from './FormField';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const clientes = useSelector((s) => s.clientes);
  const medicos = useSelector((s) => s.medicos);
  const medicamentos = useSelector((s) => s.medicamentos);
  const [activeTab, setActiveTab] = useState('clientes');
  const [alert, setAlert] = useState(null);
  const clienteModal = useModal();
  const clienteForm = useForm({ username: '', password: '', email: '', nombre: '', apellido: '', cedula: '', telefono: '', direccion: '' });

  useEffect(() => {
    dispatch(fetchClientes());
    dispatch(fetchMedicos());
    dispatch(fetchMedicamentos());
  }, [dispatch]);

  const handleDeleteMed = async (row) => {
    if (window.confirm(`¿Eliminar "${row.nombre}"?`)) {
      try { await dispatch(deleteMedicamento(row.id)).unwrap(); setAlert({ message: 'Eliminado', type: 'success' }); } catch (e) { setAlert({ message: e, type: 'error' }); }
    }
  };

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCliente(clienteForm.values)).unwrap();
      setAlert({ message: 'Cliente creado', type: 'success' });
      clienteModal.close();
      clienteForm.reset();
      dispatch(fetchClientes());
    } catch (err) { setAlert({ message: err, type: 'error' }); }
  };

  const handleDeleteCliente = async (row) => {
    if (window.confirm(`¿Eliminar a "${row.nombre || row.username}"?`)) {
      try { await dispatch(deleteCliente(row.id)).unwrap(); setAlert({ message: 'Cliente eliminado', type: 'success' }); } catch (e) { setAlert({ message: e, type: 'error' }); }
    }
  };

  const tabs = [
    { id: 'clientes', label: 'Clientes', icon: 'fa-users', count: clientes.list.length },
    { id: 'medicos', label: 'Médicos', icon: 'fa-user-md', count: medicos.list.length },
    { id: 'medicamentos', label: 'Medicamentos', icon: 'fa-capsules', count: medicamentos.list.length },
  ];

  const clienteCols = [
    { key: 'nombre', label: 'Nombre', render: (v, r) => `${r.nombre || ''} ${r.apellido || ''}`.trim() || '--' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'Email', render: (v, r) => r.email || '--' },
    { key: 'telefono', label: 'Teléfono', render: (v) => v || '--' },
  ];

  const medicoCols = [
    { key: 'username', label: 'Usuario', render: (v, r) => (
      <div><p className="font-semibold">{v || '--'}</p><p className="text-xs text-slate-400">{r.email || ''}</p></div>
    )},
    { key: 'especialidad', label: 'Especialidad', render: (v) => <span className="badge bg-sky-50 text-sky-600">{v || '--'}</span> },
    { key: 'cedula', label: 'Cédula' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  const medCols = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría', render: (v) => <span className="badge bg-sky-50 text-sky-600">{v || '--'}</span> },
    { key: 'laboratorio', label: 'Laboratorio' },
  ];

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-extrabold text-slate-800">
            <i className="fas fa-shield-alt text-sky-500 mr-2" />
            Panel de Administración
          </h2>
          <Link
            to="/admin/sistema"
            className="text-xs font-semibold text-slate-400 hover:text-amber-600 transition-colors"
            title="Ruta oculta de sistema"
          >
            <i className="fas fa-lock mr-1" /> Sistema
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className={`fas ${tab.icon}`} />
              {tab.label}
              <span className={`badge ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'clientes' && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => { clienteForm.reset(); clienteModal.open(); }} className="btn-primary btn-sm"><i className="fas fa-plus" /> Nuevo Cliente</button>
            </div>
            {clientes.loading ? <Loading /> : <DataTable columns={clienteCols} data={clientes.list} searchable pageSize={8} onDelete={handleDeleteCliente} />}
          </>
        )}
        {activeTab === 'medicos' && (
          medicos.loading ? <Loading /> : <DataTable columns={medicoCols} data={medicos.list} searchable pageSize={8} />
        )}
        {activeTab === 'medicamentos' && (
          medicamentos.loading ? <Loading /> : (
            <DataTable columns={medCols} data={medicamentos.list} searchable pageSize={8} onDelete={handleDeleteMed} />
          )
        )}
      </div>

      <Modal isOpen={clienteModal.isOpen} onClose={clienteModal.close} title="Nuevo Cliente" size="max-w-xl">
        <form onSubmit={handleCreateCliente}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Usuario" name="username" value={clienteForm.values.username} onChange={clienteForm.handleChange} required />
            <FormField label="Contraseña" name="password" type="password" value={clienteForm.values.password} onChange={clienteForm.handleChange} required />
          </div>
          <FormField label="Email" name="email" type="email" value={clienteForm.values.email} onChange={clienteForm.handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre" name="nombre" value={clienteForm.values.nombre} onChange={clienteForm.handleChange} required />
            <FormField label="Apellido" name="apellido" value={clienteForm.values.apellido} onChange={clienteForm.handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cédula" name="cedula" value={clienteForm.values.cedula} onChange={clienteForm.handleChange} required />
            <FormField label="Teléfono" name="telefono" value={clienteForm.values.telefono} onChange={clienteForm.handleChange} />
          </div>
          <FormField label="Dirección" name="direccion" value={clienteForm.values.direccion} onChange={clienteForm.handleChange} />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={clienteModal.close} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><i className="fas fa-save" /> Crear Cliente</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
